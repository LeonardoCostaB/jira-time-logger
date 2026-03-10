<template>
   <main class="rounded-2xl bg-slate-800 max-w-md mx-auto my-auto px-4 py-6 max-sm:max-w-full max-sm:mx-4 mt-10">
        <h1 class="text-2xl text-white text-center">Faça login para continuar</h1>

        <form @submit="onSubmit" class="pt-6 flex flex-col gap-4">
            <Input.Root>
                <Input.Label id="customerEmail">Email</Input.Label>
                <Input.Normal
                    v-bind="customerEmailAttrs"
                    v-model="customerEmail"
                    type="email"
                    id="customerEmail"
                    placeholder="exemplo@dominio.com"
                    :errors="hasError.email.show"
                />
                <Input.Error class="block" v-if="hasError.email.show">
                    {{ hasError.email.message }}
                </Input.Error>
            </Input.Root>

            <Input.Root>
                <Input.Label id="customerPassword">
                    Senha
                </Input.Label>
                <Input.Password
                    id="customerPassword"
                    placeholder="********"
                    v-model="customerPassword"
                    v-bind="customerPasswordAttrs"
                    :errors="hasError.password.show"
                />
                <Input.Error class="block" v-if="hasError.password.show">
                    {{ hasError.password.message }}
                </Input.Error>
            </Input.Root>

            <button
                type="submit"
                class="bg-blue-600 text-white p-2 w-full"
            >
                <PhSpinner
                    v-if="isSubmitting"
                    class="animate-spin mx-auto"
                    size="24"
                />

                <span v-else>Entrar</span>
            </button>
        </form>

        <NuxtLink
            to="/criar-conta"
            class="text-blue-400 underline mt-4 block text-center"
        >
            Não possui uma conta? Registre-se
        </NuxtLink>
   </main>
</template>

<script setup lang="ts">
    import { computed } from 'vue'
    import { PhSpinner } from '@phosphor-icons/vue'

    import { Input } from '../../components/input'
    import { useLogin } from './use-login'

    const {
        onSubmit,
        defineField,
        isSubmitting,
        errors
    } = useLogin()

    const [ customerEmail, customerEmailAttrs ] = defineField('customerEmail')
    const [ customerPassword, customerPasswordAttrs ] = defineField('customerPassword')

    const hasError = computed(() => {
        return {
            email: {
                show: !!errors.value.customerEmail,
                message: errors.value.customerEmail
            },
            password: {
                show: !!errors.value.customerPassword,
                message: errors.value.customerPassword
            }
        }
    })
</script>
