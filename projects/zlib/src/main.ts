import { getDevices } from './utils/adb'



getDevices().then(res=>{
    console.log('b',res)
})

