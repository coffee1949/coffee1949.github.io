import { exec, ExecException } from 'child_process'

/**
 * 执行指定的shell命令
 * @param command shell命令
 * @returns 命令执行结果
 */
export const execShell = (command: string) => {
    return new Promise((resolve,reject)=>{
        exec(command,(error: ExecException | null, stdout: string, stderr: string)=>{
            if(error){
                reject(error)
            }
            resolve(stdout)
        })
    })
}

export const getDevices = async () => {
    const a = await execShell('adb devices')
    console.log('a',a)
    return a
}


