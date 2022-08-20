<template>
  <div class="game-clear">
    <div class="text-frame">
      <div class="text-frame__result">
        <p class="header">Congratulation!!</p>
        <p class="result">time:{{ props.time }} moves:{{ props.moves }}</p>
      </div>
      <div class="text-frame__ranking">
        <p class="text-frame__ranking__header">Ranking</p>
        <table>
          <thead>
            <tr>
              <th>rank</th>
              <th>time</th>
              <th>moves</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(rank, i) in ranking" :key="`rank_${i}`">
              <td>{{ i + 1 }}</td>
              <td>{{ rank.time }}</td>
              <td>{{ rank.moves }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button @click.stop="retry()">RETRY</button>
    </div>
    <div class="fireworks">
      <div class="firework"></div>
      <div class="firework"></div>
      <div class="firework"></div>
      <div class="firework"></div>
      <div class="firework"></div>
      <div class="firework"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ranking } from "@/composables/ranking";

type Props = {
  moves: number;
  time: string;
  ranking: Array<Ranking>;
  retry: () => void;
};

const props = defineProps<Props>();
</script>

<style lang="scss" scoped>
@mixin createFramework($leftPosition) {
  content: "";
  position: absolute;
  top: 0;
  left: $leftPosition;
  aspect-ratio: 1;
  background: radial-gradient(
        circle,
        rgb(random(255), random(255), random(255)) 10px,
        #000 0
      )
      50% 00%,
    radial-gradient(
        circle,
        rgb(random(255), random(255), random(255)) 10px,
        #000 0
      )
      00% 50%,
    radial-gradient(
        circle,
        rgb(random(255), random(255), random(255)) 10px,
        #000 0
      )
      50% 99%,
    radial-gradient(
        circle,
        rgb(random(255), random(255), random(255)) 10px,
        #000 0
      )
      99% 50%,
    radial-gradient(
        circle,
        rgb(random(255), random(255), random(255)) 10px,
        #000 0
      )
      80% 90%,
    radial-gradient(
        circle,
        rgb(random(255), random(255), random(255)) 10px,
        #000 0
      )
      95% 90%,
    radial-gradient(
        circle,
        rgb(random(255), random(255), random(255)) 10px,
        #000 0
      )
      10% 60%,
    radial-gradient(
        circle,
        rgb(random(255), random(255), random(255)) 10px,
        #000 0
      )
      31% 80%,
    radial-gradient(
        circle,
        rgb(random(255), random(255), random(255)) 10px,
        #000 0
      )
      80% 10%,
    radial-gradient(
        circle,
        rgb(random(255), random(255), random(255)) 10px,
        #000 0
      )
      90% 23%,
    radial-gradient(
        circle,
        rgb(random(255), random(255), random(255)) 10px,
        #000 0
      )
      45% 20%,
    radial-gradient(
        circle,
        rgb(random(255), random(255), random(255)) 10px,
        #000 0
      )
      13% 24%,
    radial-gradient(
        circle,
        rgb(random(255), random(255), random(255)) 10px,
        #000 0
      )
      13% 24%,
    radial-gradient(
        circle,
        rgb(random(255), random(255), random(255)) 10px,
        #000 0
      )
      13% 24%,
    radial-gradient(
        circle,
        rgb(random(255), random(255), random(255)) 10px,
        #000 0
      )
      13% 24%,
    radial-gradient(
        circle,
        rgb(random(255), random(255), random(255)) 10px,
        #000 0
      )
      13% 24%,
    radial-gradient(
        circle,
        rgb(random(255), random(255), random(255)) 10px,
        #000 0
      )
      13% 24%,
    radial-gradient(
        circle,
        rgb(random(255), random(255), random(255)) 10px,
        #000 0
      )
      13% 24%,
    radial-gradient(
        circle,
        rgb(random(255), random(255), random(255)) 10px,
        #000 0
      )
      13% 24%,
    radial-gradient(
        circle,
        rgb(random(255), random(255), random(255)) 10px,
        #000 0
      )
      13% 24%;
  background-size: 4px 4px;
  background-repeat: no-repeat;
  transform: translate(-50%, -20%);
}
.game-clear {
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  overflow: hidden;
  .text-frame {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    color: rgba(255, 255, 255, 0.8);
    text-align: center;
    .header {
      font-size: 4rem;
      font-weight: bold;
    }
    &__result {
      font-size: 2rem;
      margin-bottom: 10px;
    }
    &__ranking {
      &__header {
        font-size: 1.3rem;
        font-weight: bold;
      }
      font-size: 1.2rem;
      margin-bottom: 20px;
      table {
        td,
        th {
          padding: 2px 10px;
        }
      }
    }
    button {
      display: inline-block;
      border: 1px solid var(--vt-c-text-dark-2);
      background-color: rgba(255, 255, 255, 0.2);
      color: var(--vt-c-text-dark-2);
      padding: 20px;
      border-radius: 5px;
      font-size: 2rem;
      cursor: pointer;
    }
  }
}

@keyframes fireworks-animation {
  0% {
    transform: translate(0%, 100vh);
    width: 4px;
    opacity: 1;
  }
  50% {
    width: 4px;
    opacity: 1;
  }
  90% {
    width: 500px;
    opacity: 0.8;
  }
  100% {
    width: 500px;
    opacity: 0;
  }
}

.fireworks {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  @for $i from 1 through 7 {
    .firework:nth-of-type(#{$i}) {
    }
    .firework:nth-of-type(#{$i})::before {
      @include createFramework(random(100) * 1%);
      animation: fireworks-animation 3s infinite;
    }
    .firework:nth-of-type(#{$i})::after {
      @include createFramework(random(100) * 1%);
      animation: fireworks-animation 2s infinite;
    }
    .firework::before {
      transform: translate(-50%, -50%) rotate(25deg);
    }
    .firework::after {
      transform: translate(-50%, -50%) rotate(-50deg);
    }
  }
}
</style>
