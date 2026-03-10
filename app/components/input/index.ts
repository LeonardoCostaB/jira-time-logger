import InputRoot from './input-root.vue'
import InputLabel from './input-label.vue'
import InputNormal from './input-normal.vue'
import InputPassword from './input-password.vue'
import InputError from './input-error.vue'

const Input = {
    Root: InputRoot,
    Label: InputLabel,
    Normal: InputNormal,
    Password: InputPassword,
    Error: InputError,
} as const

export { Input }
