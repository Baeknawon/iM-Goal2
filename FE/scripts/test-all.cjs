const {spawnSync}=require('node:child_process');
const path=require('node:path');
for(const file of ['test-finance.cjs','test-finance-eta.cjs','test-distribution-report.cjs','test-recovery.cjs','test-recovery-stages.cjs','test-mission-flow.cjs','test-adaptive-missions.cjs','test-insights.cjs','test-persistence-support.cjs','test-goal-nl.cjs','test-goal-editing-connectivity.cjs']){
 const result=spawnSync(process.execPath,[path.join(__dirname,file)],{stdio:'inherit'});
 if(result.error)throw result.error;if(result.status!==0)process.exit(result.status??1);
}
