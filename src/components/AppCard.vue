<script setup lang="ts">
</script>

<template>
  <div class="card">
    <slot />
  </div>
</template>

<style scoped>
.card {
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.06);
}
</style>
