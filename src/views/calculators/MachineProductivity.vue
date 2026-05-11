<template>
  <CalcLayout>
    <template #header>
      <div class="mb-4">
        <h1 class="page-title">{{ t('calc.machineProd.icon') }} {{ t('calc.machineProd.title') }}</h1>
        <p class="page-subtitle">{{ t('calc.machineProd.desc') }}</p>
      </div>
    </template>

    <template #inputs>
      <div class="section-card mb-3">
        <div class="section-title">{{ t('sec.inputs') }}</div>
        <div class="space-y-3">
          <div>
            <label class="calc-label">{{ t('lbl.totalOutput') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.output" type="number" min="0" step="1" placeholder="e.g. 3000" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.machines') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.machines" type="number" min="1" step="1" placeholder="e.g. 25" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.hoursPerDay') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.hours" type="number" min="0" step="0.5" placeholder="e.g. 8" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.workingDays') }} <span class="text-gray-400 text-xs font-normal">(optional)</span></label>
            <input v-model.number="form.days" type="number" min="1" step="1" placeholder="e.g. 26" class="calc-input" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-4">
          <button @click="calculate" class="calc-btn">{{ t('btn.calculate') }}</button>
          <button @click="reset" class="calc-btn-secondary">{{ t('btn.reset') }}</button>
        </div>
      </div>
    </template>

    <template #results>
      <div v-if="result" class="section-card">
        <div class="section-title">{{ t('sec.results') }}</div>
        <div class="result-box text-center mb-3">
          <div class="result-value">{{ result.perMachinePerHour }}</div>
          <div class="result-label">{{ t('res.perMachinePerHour') }}</div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="result-card">
            <div class="result-card-value">{{ result.perMachinePerDay }}</div>
            <div class="result-card-label">{{ t('res.perMachinePerDay') }}</div>
          </div>
          <div v-if="result.perMachineTotal" class="result-card">
            <div class="result-card-value">{{ result.perMachineTotal }}</div>
            <div class="result-card-label">{{ t('res.perMachineTotal') }}</div>
          </div>
        </div>
        <div class="formula-box">
          Per Machine / Hour = Total Output / (Machines × Hours × Days)<br>
          Per Machine / Day = Per Machine / Hour × Hours
        </div>
      </div>
      <div v-if="error" class="error-box mt-3">{{ error }}</div>
    </template>
  </CalcLayout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useLang } from '../../composables/useLang.js'
import CalcLayout from '../../components/CalcLayout.vue'

const { t } = useLang()
const form = reactive({ output: null, machines: null, hours: 8, days: null })
const result = ref(null)
const error = ref('')

function calculate() {
  error.value = ''; result.value = null
  const { output, machines, hours, days } = form
  if (!output || output < 0)      return (error.value = t('err.invalidOutput'))
  if (!machines || machines <= 0) return (error.value = t('err.invalidMachines'))
  if (!hours || hours <= 0)       return (error.value = t('err.invalidHours'))
  const d = days > 0 ? days : 1
  const perMachinePerHour = output / (machines * hours * d)
  result.value = {
    perMachinePerHour: parseFloat(perMachinePerHour.toFixed(2)),
    perMachinePerDay:  parseFloat((perMachinePerHour * hours).toFixed(2)),
    perMachineTotal:   days > 0 ? parseFloat((output / machines).toFixed(2)) : null,
  }
}
function reset() {
  form.output = null; form.machines = null; form.hours = 8; form.days = null
  result.value = null; error.value = ''
}
</script>
