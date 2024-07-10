
import { exec } from 'child-process-promise'
import { copySync, removeSync } from 'fs-extra'
import { resolve } from 'path'

import { modules, split_modules } from './build.utils'

await exec('tsc -p ./tsconfig.build.json')

modules.concat(split_modules).forEach(name => {
	copySync(`./.ts-temp/${name}/src`, resolve(__dirname, `./packages/${name}/dist`))
})

removeSync(`./.ts-temp`)