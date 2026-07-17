<script setup lang="ts">
import { ref } from 'vue'

const version = ref<string>(__APP_VERSION__)
</script>

<template>
  <footer class="footer-root">
    <div class="footer-main">
      <div class="footer-brand">
        <span>RER - Data Sharing Platform</span>
        <span class="footer-version">v{{ version }}</span>
      </div>
      <p class="footer-hint">
        Data Sharing Platform (DSP) — public geospatial consultation portal
      </p>
    </div>
    <div class="footer-copyright">
      <span>
        Text intended to display information related to the
        <strong>usage license</strong>
      </span>
    </div>
  </footer>
</template>

<style scoped>
.footer-root {
  margin-top: auto;
}

.footer-main {
  background: #071d41;
  color: #fff;
  padding: 28px 40px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #fff;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
}

.footer-version {
  font-size: 12px;
  opacity: 0.9;
}

.footer-hint {
  margin: 0;
  font-size: 13px;
  opacity: 0.9;
  max-width: 420px;
}

.footer-copyright {
  background: #071d41;
  padding: 15px 40px;
  text-align: center;
  color: #fff;
  font-size: 12.6px;
}
</style>
