<template>
  <div>
    <button class="bgm-btn" @click="toggleBgm">
      {{ isBgmPlaying ? '暫停' : '播放' }}背景音樂
    </button>
    <audio ref="bgm" src="/src/assets/background.mp3" loop></audio>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';

const bgm = ref(null);
const isBgmPlaying = ref(true);

function toggleBgm() {
  isBgmPlaying.value = !isBgmPlaying.value;
}

watchEffect(() => {
  if (!bgm.value) return;
  if (isBgmPlaying.value) {
    bgm.value.play().catch(() => {
      isBgmPlaying.value = false;
    });
  } else {
    bgm.value.pause();
  }
});
</script>

<style scoped>
.bgm-btn {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1000;
}
</style>
