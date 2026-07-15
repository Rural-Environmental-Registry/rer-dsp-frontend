<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBarComponent from '@/components/NavBarComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white">
    <NavBarComponent />
    <main class="w-full flex-grow">
      <RouterView />
    </main>
    <FooterComponent />
  </div>
</template>
