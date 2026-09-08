export const NAMES=['Armchair','Desk','Plant','Floor lamp','Coffee table'];
export const ACTIONS=['Reuse','Repair','Buy new','Leave out'];
export const CONDITIONS=['Ready to use','Needs repair','Not suitable'];
export function initialPlan(){return {version:1,title:'My second room',layout:'Studio',atmosphere:'Daylight',selected:'Desk',items:NAMES.map((name,i)=>({name,action:['Reuse','Repair','Reuse','Buy new','Reuse'][i],condition:['Ready to use','Needs repair','Ready to use','Not suitable','Ready to use'][i],replacement:[180,160,25,175,90][i],repair:i===1?35:0,x:0,rotation:0,completed:false,note:i===1?'Inspect the desk and arrange a suitable repair before reuse.':''}))};}
const money=v=>Number.isFinite(Number(v))?Math.round(Math.max(0,Math.min(100000,Number(v)))*100)/100:0;
const finite=(v,min,max)=>Number.isFinite(Number(v))?Math.max(min,Math.min(max,Number(v))):0;
export function normalize(value){
 if(!value||value.version!==1||!Array.isArray(value.items))throw Error('Use a Second Room version 1 plan.');
 const base=initialPlan();
 base.title=String(value.title||base.title).trim().slice(0,80)||base.title;
 if(['Studio','Lounge'].includes(value.layout))base.layout=value.layout;
 if(['Daylight','Golden hour','Night'].includes(value.atmosphere))base.atmosphere=value.atmosphere;
 if(NAMES.includes(value.selected))base.selected=value.selected;
 base.items=base.items.map(seed=>{const raw=value.items.find(i=>i&&i.name===seed.name);if(!raw)return seed;const action=ACTIONS.includes(raw.action)?raw.action:seed.action;return {...seed,action,condition:CONDITIONS.includes(raw.condition)?raw.condition:seed.condition,replacement:money(raw.replacement),repair:money(raw.repair),x:finite(raw.x,-.7,.7),rotation:finite(raw.rotation,-180,180),completed:['Reuse','Repair'].includes(action)&&raw.completed===true,note:String(raw.note||'').slice(0,500)};});return base;
}
export function updateItem(plan,name,patch){return normalize({...plan,items:plan.items.map(item=>item.name!==name?item:{...item,...patch,completed:patch.action&&patch.action!==item.action?false:patch.completed??item.completed})});}
export function totals(plan){
 const included=plan.items.filter(i=>i.action!=='Leave out');
 const baseline=included.reduce((n,i)=>n+i.replacement,0);
 const planned=included.reduce((n,i)=>n+(i.action==='Buy new'?i.replacement:i.action==='Repair'?i.repair:0),0);
 return {included:included.length,reuse:included.filter(i=>i.action==='Reuse').length,repair:included.filter(i=>i.action==='Repair').length,buy:included.filter(i=>i.action==='Buy new').length,completed:included.filter(i=>['Reuse','Repair'].includes(i.action)&&i.completed).length,baseline:Math.round(baseline*100)/100,planned:Math.round(planned*100)/100,difference:Math.round((baseline-planned)*100)/100};
}
export function suggest(plan){return normalize({...plan,items:plan.items.map(i=>({...i,action:{'Ready to use':'Reuse','Needs repair':'Repair','Not suitable':'Leave out'}[i.condition],completed:false}))});}
export function checklist(plan){return plan.items.filter(i=>i.action!=='Leave out').map(i=>({name:i.name,action:i.action,completed:i.completed,cost:i.action==='Buy new'?i.replacement:i.action==='Repair'?i.repair:0,task:i.action==='Reuse'?'Check condition and measurements, then place the existing item.':i.action==='Repair'?'Assess repair suitability and arrange repair before use. Electrical work needs a qualified professional.':'Confirm there is no suitable existing or second-hand option before purchasing.',note:i.note}));}
export function toScene(plan){return {layout:plan.layout,atmosphere:plan.atmosphere,finish:'Chalk',light:true,selected:plan.selected,objects:Object.fromEntries(plan.items.map(i=>[i.name,{x:i.x,rotation:i.rotation}]))};}
export const serialize=plan=>JSON.stringify({format:'second-room-plan',...normalize(plan),units:{currency:'EUR',translation:'metres'},notice:'Planning figures entered by the user. Completed reuse is self-reported. No carbon or waste-diversion estimate.'},null,2);
export function parsePlan(text){if(new TextEncoder().encode(text).length>65536)throw Error('Plan must be smaller than 64 KB.');const value=JSON.parse(text);if(value.format!=='second-room-plan')throw Error('This is not a Second Room plan.');return normalize(value);}
export function report(plan){const t=totals(plan);return `SECOND ROOM — ${plan.title}\n\nLayout: ${plan.layout}\nReuse planned: ${t.reuse}; repair planned: ${t.repair}; new purchases: ${t.buy}\nConfirmed reused (self-reported): ${t.completed}\nReplacement baseline: EUR ${t.baseline.toFixed(2)}\nPlanned budget: EUR ${t.planned.toFixed(2)}\nBudget difference: EUR ${t.difference.toFixed(2)}\n\n${checklist(plan).map(i=>`${i.completed?'[x]':'[ ]'} ${i.name} — ${i.action} — EUR ${i.cost.toFixed(2)}\n${i.task}${i.note?'\nNote: '+i.note:''}`).join('\n\n')}\n\nFigures are editable planning inputs, not quotes or measured environmental outcomes. No carbon estimate. This is not a collision, engineering or safety assessment.\n`;}
