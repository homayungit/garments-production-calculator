import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { title: 'Production Calculators' } },
  { path: '/sam',          name: 'SAM',          component: () => import('../views/calculators/OperationSAM.vue'),              meta: { title: 'Operation SAM/SMV Calculator',      category: 'efficiency' } },
  { path: '/line-efficiency', name: 'LineEff',   component: () => import('../views/calculators/LineEfficiency.vue'),            meta: { title: 'Line Efficiency Calculator',        category: 'production' } },
  { path: '/line-oee',     name: 'LineOEE',      component: () => import('../views/calculators/LineOEE.vue'),                   meta: { title: 'Line OEE Calculator',               category: 'production' } },
  { path: '/emp-efficiency', name: 'EmpEff',     component: () => import('../views/calculators/EmployeeEfficiency.vue'),        meta: { title: 'Employee Efficiency Calculator',    category: 'efficiency' } },
  { path: '/emp-efficiency-multi', name: 'EmpEffMulti', component: () => import('../views/calculators/EmployeeEfficiencyMulti.vue'), meta: { title: 'Employee Efficiency (Multi-Op)', category: 'efficiency' } },
  { path: '/production-capacity', name: 'ProdCap', component: () => import('../views/calculators/ProductionCapacity.vue'),     meta: { title: 'Production Capacity Calculator',    category: 'production' } },
  { path: '/line-sah',     name: 'LineSAH',      component: () => import('../views/calculators/LineSAH.vue'),                  meta: { title: 'Line SAH Calculator',               category: 'production' } },
  { path: '/hourly-target', name: 'HourlyTarget', component: () => import('../views/calculators/HourlyTarget.vue'),            meta: { title: 'Hourly Production Target',           category: 'production' } },
  { path: '/labour-productivity', name: 'LabourProd', component: () => import('../views/calculators/LabourProductivity.vue'),  meta: { title: 'Labour Productivity Calculator',    category: 'efficiency' } },
  { path: '/machine-productivity', name: 'MachineProd', component: () => import('../views/calculators/MachineProductivity.vue'), meta: { title: 'Machine Productivity Calculator', category: 'efficiency' } },
  { path: '/dhu',          name: 'DHU',           component: () => import('../views/calculators/QualityDHU.vue'),              meta: { title: 'Quality DHU Calculator',             category: 'quality'    } },
  { path: '/tshirt-fabric', name: 'TShirtFabric', component: () => import('../views/calculators/TShirtFabric.vue'),           meta: { title: 'T-Shirt Fabric Consumption',         category: 'fabric'     } },
  { path: '/woven-fabric', name: 'WovenFabric',   component: () => import('../views/calculators/WovenShirtFabric.vue'),       meta: { title: 'Woven Shirt Fabric Consumption',     category: 'fabric'     } },
  { path: '/kg-to-meter',  name: 'KgToMeter',     component: () => import('../views/calculators/KgToMeter.vue'),              meta: { title: 'Knits: Kg → Meter',                  category: 'fabric'     } },
  { path: '/meter-to-kg',  name: 'MeterToKg',     component: () => import('../views/calculators/MeterToKg.vue'),              meta: { title: 'Knits: Meter → Kg',                  category: 'fabric'     } },
  { path: '/kg-to-yards',  name: 'KgToYards',     component: () => import('../views/calculators/KgToYards.vue'),              meta: { title: 'Knits: Kg → Yards',                  category: 'fabric'     } },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} | GPC`
    : 'Garments Production Calculator'
})
