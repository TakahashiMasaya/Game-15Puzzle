<template>
  <div
    class="frame"
    @touchmove="moveParts"
    @touchend="moveEnd"
    @mousemove.stop="moveParts"
    @mouseup.stop="moveEnd"
  >
    <div class="frame__inner">
      <div
        v-for="(parts, i) in partsList"
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";

type Parts = {
  number: number;
  ableToMove: string | null;
  selected: boolean;
  action: string | null;
};

type PartsList = Array<Parts | null>;

const partsList: Ref<PartsList> = ref([
  { number: 1, ableToMove: null, selected: false, action: null },
  { number: 2, ableToMove: null, selected: false, action: null },
  { number: 3, ableToMove: null, selected: false, action: null },
  { number: 4, ableToMove: null, selected: false, action: null },
  { number: 5, ableToMove: null, selected: false, action: null },
  { number: 6, ableToMove: null, selected: false, action: null },
  { number: 7, ableToMove: null, selected: false, action: null },
  { number: 8, ableToMove: null, selected: false, action: null },
  { number: 9, ableToMove: null, selected: false, action: null },
  { number: 10, ableToMove: null, selected: false, action: null },
  { number: 11, ableToMove: null, selected: false, action: null },
  { number: 12, ableToMove: null, selected: false, action: null },
  { number: 13, ableToMove: null, selected: false, action: null },
  { number: 14, ableToMove: null, selected: false, action: null },
  { number: 15, ableToMove: null, selected: false, action: null },
  null,
]);

const setAbleToMove = () => {
  // 上下左右に空きがあるか確認
  partsList.value = partsList.value.reduce<PartsList>((ar, cu, ci, array) => {
    if (cu === null) {
      return [...ar, cu];
    }
    const checked = {
      top: array[ci - 4],
      left: array[ci - 1] && ci % 4 !== 0,
      right: array[ci + 1] && ci % 4 !== 3,
      down: array[ci + 4],
    };
    const ableToMove = Object.keys(checked).find(
      (c) =>
        (c === "top" || c === "left" || c === "right" || c === "down") &&
        checked[c] === null
    );
    if (ableToMove) {
      return [
        ...ar,
        {
          ...cu,
          ableToMove,
        },
      ];
    }
    return [...ar, cu];
  }, []);
};

const selectedParts = ref<{
  x: number;
  y: number;
} | null>(null);

const arrayShuffle = (array: PartsList) => {
  for (let i = array.length - 1; 0 < i; i--) {
    // 0〜(i+1)の範囲で値を取得
    const r = Math.floor(Math.random() * (i + 1));

    // 要素の並び替えを実行
    const tmp = array[i];
    array[i] = array[r];
    array[r] = tmp;
  }
  return array;
};

const setStyleParts = (parts: Parts | null) => {
  if (parts === null) {
    return "parts empty";
  }
  if (parts.selected) {
    return `parts selected ${parts.action ? parts.action : ""}`;
  }
  return "parts";
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

const hasSelectedParts = () =>
  partsList.value.some((parts) => parts !== null && parts.selected);

const isEmpty = (e: Event) =>
  Array.from((e.currentTarget as HTMLDivElement)?.classList).includes("empty");

const isPartsDivElement = (parts: any): parts is HTMLDivElement =>
  parts instanceof HTMLDivElement;

const getSelectedPartsMove = () =>
  partsList.value.find(
    (parts) => parts !== null && parts.selected && parts.ableToMove !== null
  ) || null;

onMounted(() => {
  partsList.value = arrayShuffle(partsList.value);
  setAbleToMove();
});

const moveStart = (e: Event) => {
  if (isEmpty(e)) {
    return;
  }
  setSelectedParts(e);
  partsList.value = partsList.value.map((parts) => {
    if (parts === null) {
      return parts;
    }
    return {
      ...parts,
      selected:
        parseInt((e.currentTarget as HTMLDivElement).dataset.number || "") ===
          parts.number && parts.ableToMove !== null,
    };
  });
};
const moveParts = (e: Event) => {
  if (!isEmpty(e) && hasSelectedParts()) {
    // 移動表現
    const sp = getSelectedPartsMove();
    if (sp) {
      switch (sp.ableToMove) {
        case "top": {
          sp.action = overOffsetTop(e) ? "move-top" : null;
          break;
        }
        case "down": {
          sp.action = overOffsetDown(e) ? "move-down" : null;
          break;
        }
        case "left": {
          sp.action = overOffsetLeft(e) ? "move-left" : null;
          break;
        }
        case "right": {
          sp.action = overOffsetRight(e) ? "move-right" : null;
          break;
        }
        default:
      }
    }
  }
};
const moveEnd = () => {
  selectedParts.value = null;
  // actionがない場合はそのまま
  const activeParts =
    partsList.value.find((parts) => parts !== null && parts.action !== null) ||
    null;
  if (activeParts === null) {
    partsList.value = partsList.value.map((parts) => {
      if (parts === null) {
        return parts;
      }
      return {
        ...parts,
        ableToMove: null,
        selected: false,
        action: null,
      };
    });
    setAbleToMove();
    return;
  }
  // actionがあれば、nullと入れ替える
  partsList.value = partsList.value.reduce<PartsList>((ar, cu) => {
    if (cu === activeParts) {
      return [...ar, null];
    }
    if (cu === null) {
      return [
        ...ar,
        {
          ...activeParts,
          ableToMove: null,
          selected: false,
          action: null,
        },
      ];
    }
    return [
      ...ar,
      {
        ...cu,
        ableToMove: null,
        selected: false,
        action: null,
      },
    ];
  }, []);
  setAbleToMove();
};
</script>

<style lang="scss" scoped>
.frame {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
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
        border: 3px solid rgba(255, 100, 100, 1);
        background-color: rgba(100, 100, 100, 1);
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
}
</style>
