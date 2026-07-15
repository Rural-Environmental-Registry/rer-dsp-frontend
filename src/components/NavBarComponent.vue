<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { computed } from 'vue'
import govbrLogo from '@/assets/images/govbr.svg'

const route = useRoute()

const links = [
  { to: '/', label: 'Página Principal', name: 'home' },
  { to: '/geoservices', label: 'Downloads', name: 'geoservices' },
]

const isActive = computed(() => (name: string) => route.name === name)
</script>

<template>
  <header class="header-container">
    <div class="branding-section">
      <RouterLink to="/" class="branding-link">
        <img :src="govbrLogo" alt="Logomarca do gov.br" class="govbr-logo" />
        <h2>RER - Data Sharing Plataform</h2>
      </RouterLink>
    </div>

    <nav class="nav-menu">
      <ul>
        <li v-for="link in links" :key="link.name">
          <RouterLink
            :to="link.to"
            class="nav-link"
            :class="{ 'nav-link--active': isActive(link.name) }"
          >
            {{ link.label }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.header-container {
  background: #ffffff;
  box-shadow: 0 1px 6px #00000029;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 3vw;
}

.branding-link {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
}

.govbr-logo {
  width: 50px;
  height: 30px;
  padding-top: 4px;
  padding-bottom: 6px;
}

.branding-section h1 {
  margin: 0;
  text-align: left;
  font-size: 24px;
  font-weight: 100;
  color: #000000;
}

.nav-menu ul {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  color: #1351b4;
  font-size: 14.67px;
  text-decoration: none;
  cursor: pointer;
}

.nav-link--active {
  font-weight: 600;
  border-bottom: 2px solid #1351b4;
  padding-bottom: 2px;
}

@media screen and (max-width: 950px) {
  .header-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-menu ul {
    gap: 12px;
  }
}
</style>
