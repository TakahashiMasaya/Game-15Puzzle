<template>
  <game-start
    v-if="gameStatusPlaying === false"
    :start="
      () => {
        gameStatusPlaying = true;
        // パーツをシャッフルし、移動できるパーツを設定する
        shuffleParts();
        changePartsStatusToMove();
        startTimer();
      }
    "
  ></game-start>
  <div v-else class="playing">
    <game-clear-vue
      v-if="isComplete()"
      :moves="getStatus().moves"
      :time="getStatus().time"
      :ranking="getRanking()"
      :retry="reset"
    ></game-clear-vue>
    <div
      v-else
      class="frame"
      @touchmove="moveParts"
      @touchend="moveEnd"
      @mousemove.stop="moveParts"
      @mouseup.stop="moveEnd"
    >
      <div class="frame__status">
        <p>Time: {{ getStatus().time }}</p>
        <p>/</p>
        <p>Moves: {{ getStatus().moves }}</p>
      </div>
      <div class="frame__inner">
        <div
          v-for="(parts, i) in getPartsList()"
          draggable="false"
          :class="setStyleParts(parts)"
          :key="`parts_${i}`"
          :data-able-to-move="parts && parts.ableToMove"
          :data-number="parts && parts.number"
          @touchstart.stop="moveStart"
          @touchmove="moveParts"
          @touchend="moveEnd"
          @mousedown.stop="moveStart"
          @mousemove.stop="moveParts"
          @mouseup.stop="moveEnd"
          :ref="parts === null ? 'empty' : ''"
        >
          {{ parts && parts.number }}
        </div>
      </div>
      <button @click="reset">RESET</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import GameClearVue from './GameClear.vue';
import { useRanking } from '@/composables/ranking';
import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';
import { useParts } from '@/composables/parts';
import GameStart from './GameStart.vue';
import { GamepadDevice } from '@/composables/gamepad';
const {
  getPartsList,
  shuffleParts,
  isComplete,
  changePartsStatusToMove,
  getSelectedParts,
  setSelectedParts: useToSetSelectedParts,
  hasSelectedParts,
  changePartsToEmpty,
  statusClearAll,
  activeParts,
  moveParts: useToMoveParts,
} = useParts();

const {
  startTimer,
  stopTimer,
  getStatus,
  resetStatus,
  addMoveCount,
  insertRanking,
  getRanking,
} = useRanking();

type Parts = {
  number: number;
  ableToMove: string | null;
  selected: boolean;
  action: string | null;
};

const gamepadDevice = new GamepadDevice();

const requestAnimationId = ref<number>(0);

const gameStatusPlaying = ref<boolean>(false);

const selectedParts = ref<{
  x: number;
  y: number;
} | null>(null);

const setStyleParts = (parts: Parts | null) => {
  if (parts === null) {
    return 'parts empty';
  }
  if (parts.selected) {
    return `parts selected ${parts.action ? parts.action : ''}`;
  }
  return 'parts';
};

const setSelectedParts = (e: Event) => {
  if (!isPartsDivElement(e.currentTarget)) {
    return;
  }
  selectedParts.value = {
    x: getPageX(e),
    y: getPageY(e),
  };
};

watch(isComplete, () => {
  if (isComplete() === true) {
    stopTimer();
    insertRanking(getStatus());
  }
});

const getPageX = (e: Event) =>
  window.ontouchstart === null
    ? (e as TouchEvent).changedTouches &&
      (e as TouchEvent).changedTouches[0].pageX
    : (e as MouseEvent).pageX;

const getPageY = (e: Event) =>
  window.ontouchstart === null
    ? (e as TouchEvent).changedTouches &&
      (e as TouchEvent).changedTouches[0].pageY
    : (e as MouseEvent).pageY;

const overOffsetLeft = (e: Event) => {
  if (selectedParts.value === null) {
    return false;
  }
  return Math.trunc(selectedParts.value.x - getPageX(e)) > 10;
};

const overOffsetRight = (e: Event) => {
  if (selectedParts.value === null) {
    return false;
  }
  return Math.trunc(getPageX(e) - selectedParts.value.x) > 10;
};

const overOffsetTop = (e: Event) => {
  if (selectedParts.value === null) {
    return false;
  }
  return Math.trunc(selectedParts.value.y - getPageY(e)) > 10;
};

const overOffsetDown = (e: Event) => {
  if (selectedParts.value === null) {
    return false;
  }
  return Math.trunc(getPageY(e) - selectedParts.value.y) > 10;
};

const isEmpty = (e: Event) =>
  Array.from((e.currentTarget as HTMLDivElement)?.classList).includes('empty');

const isPartsDivElement = (parts: unknown): parts is HTMLDivElement =>
  parts instanceof HTMLDivElement;

const reset = () => {
  shuffleParts();
  changePartsStatusToMove();
  resetStatus();
  stopTimer();
  startTimer();
};

const startAnimation = () => {
  const loop = () => {
    requestAnimationId.value = window.requestAnimationFrame(loop);
    gamepadDevice.do();
  };
  requestAnimationId.value = window.requestAnimationFrame(loop);
};

onMounted(() => {
  document.addEventListener('keyup', keyup);
  gamepadDevice.init({
    connected: () => {
      startAnimation();
    },
    disconnected: () => {
      window.cancelAnimationFrame(requestAnimationId.value);
    },
    down: () => {
      useToMoveParts('down');
      addMoveCount();
    },
    up: () => {
      useToMoveParts('top');
      addMoveCount();
    },
    left: () => {
      useToMoveParts('left');
      addMoveCount();
    },
    right: () => {
      useToMoveParts('right');
      addMoveCount();
    },
  });
});

onBeforeUnmount(() => {
  document.removeEventListener('keyup', keyup);
});

// キーボードイベント設定
const keyup = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowDown':
      useToMoveParts('down');
      break;
    case 'ArrowUp':
      useToMoveParts('top');
      break;
    case 'ArrowLeft':
      useToMoveParts('left');
      break;
    case 'ArrowRight':
      useToMoveParts('right');
      break;
    default:
  }
  if (activeParts() === null) {
    return;
  }
  addMoveCount();
};

// パーツ動かし始めのイベント
const moveStart = (e: Event) => {
  if (isEmpty(e)) {
    return;
  }
  setSelectedParts(e);
  useToSetSelectedParts(
    parseInt((e.currentTarget as HTMLDivElement).dataset.number || '')
  );
};

// パーツ動かし中のイベント
const moveParts = (e: Event) => {
  if (!isEmpty(e) && hasSelectedParts()) {
    // 移動表現
    const sp = getSelectedParts();
    if (sp) {
      switch (sp.ableToMove) {
        case 'top': {
          sp.action = overOffsetTop(e) ? 'move-top' : null;
          break;
        }
        case 'down': {
          sp.action = overOffsetDown(e) ? 'move-down' : null;
          break;
        }
        case 'left': {
          sp.action = overOffsetLeft(e) ? 'move-left' : null;
          break;
        }
        case 'right': {
          sp.action = overOffsetRight(e) ? 'move-right' : null;
          break;
        }
        default:
      }
    }
  }
};

// パーツ動かし完了イベント
const moveEnd = () => {
  selectedParts.value = null;
  // actionがない場合はそのまま
  const ap = activeParts();
  if (ap === null) {
    statusClearAll();
    changePartsStatusToMove();
    return;
  }
  // actionがあれば、nullと入れ替える
  changePartsToEmpty();
  changePartsStatusToMove();
  addMoveCount();
};
</script>

<style lang="scss" scoped>
.playing {
  width: 100%;
  height: 100%;
}
.frame {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-direction: column;
  &__inner {
    box-shadow: 0px 0px 0px 10px rgb(255 255 255 / 50%);
    background-color: rgba(0, 0, 0, 1);
    position: relative;
    width: 320px;
    height: 320px;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
    margin-bottom: 30px;
    .parts {
      width: 80px;
      height: 80px;
      border: 1px solid rgba(100, 100, 100, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 2rem;
      background-color: rgba(50, 50, 50, 1);
      user-select: none;
      position: relative;
      z-index: 3;
      transition: transform 0.1s;
      &.selected {
        border: 3px solid rgb(100 175 255);
        background-color: rgb(45 80 239);
      }
      &.empty {
        cursor: default;
        background-color: inherit;
        border: none;
        z-index: 2;
      }
      &.move-top {
        transform: translate(0px, -80px);
      }
      &.move-left {
        transform: translate(-80px, 0px);
      }
      &.move-right {
        transform: translate(80px, 0px);
      }
      &.move-down {
        transform: translate(0px, 80px);
      }
    }
  }
  &__status {
    border: 3px solid var(--vt-c-text-dark-2);
    margin-bottom: 30px;
    font-size: 1.5rem;
    width: 340px;
    border-radius: 5px;
    padding: 5px 10px;
    text-align: center;
    overflow: hidden;
  }
  button {
    display: inline-block;
    border: 3px solid var(--vt-c-text-dark-2);
    background-color: rgba(255, 255, 255, 0.2);
    color: var(--vt-c-text-dark-2);
    padding: 20px;
    border-radius: 5px;
    font-size: 2rem;
    cursor: pointer;
  }
}

@media screen and (orientation: landscape) {
  .frame {
    flex-direction: row;
    &__status {
      margin: 0;
      width: 10rem;
      margin-right: 1rem;
      p {
        white-space: nowrap;
        &:nth-of-type(2) {
          display: none;
        }
      }
    }
    &__inner {
      margin: 0;
      margin-right: 1rem;
    }
  }
}

@media screen and (orientation: portrait) {
  .frame {
    flex-direction: column;
    &__status {
      p {
        display: inline-block;
        padding: 0.2rem;
      }
    }
  }
}
</style>
