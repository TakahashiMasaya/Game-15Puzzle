<template>
  <div class="game-start">
    <p>15 Puzzle Game</p>
    <button @click.stop="start">Press Start!!</button>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  start: () => void;
}>();
</script>

<style lang="scss" scoped>
.game-start {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  width: 100%;
  p {
    font-size: 4rem;
    font-weight: bold;
    line-height: 4rem;
    margin-bottom: 30px;
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
</style>
