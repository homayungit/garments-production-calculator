<template>
  <div>
    <slot name="header" />
    <div class="lg:grid lg:grid-cols-2 lg:gap-5 lg:items-start">
      <div><slot name="inputs" /></div>
      <div><slot name="results" /></div>
    </div>
  </div>
</template>
