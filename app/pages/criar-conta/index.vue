<script setup lang="ts">
    import { computed } from 'vue'
    import { PhArrowLeft } from '@phosphor-icons/vue'

    import { useRegister } from './use-register'

    import { Input } from '../../components/input'

    const {
        onSubmit,
        defineField,
        errors
    } = useRegister()

    const [
        name,
        nameAttrs
    ] = defineField('name')

    const [
        lastName,
        lastNameAttrs
    ] = defineField('lastName')

    const [
        email,
        emailAttrs
    ] = defineField('email')

    const [
        password,
        passwordAttrs
    ] = defineField('password')

    const hasErrors = computed(() => {
        return {
            name: {
                show: !!errors.value.name,
                message: errors.value.name
            },
            lastName: {
                show: !!errors.value.lastName,
                message: errors.value.lastName
            },
            email: {
                show: !!errors.value.email,
                message: errors.value.email
            },
            password: {
                show: !!errors.value.password,
                message: errors.value.password
            }
        }
    })
</script>

<template>
    <main class="rounded-2xl bg-slate-800 max-w-lg mx-auto px-4 py-6 max-sm:max-w-full max-sm:mx-4">
          <div class="flex items-center relative">
                <NuxtLink
                     to="/login"
                     class="text-white underline bg-slate-700 p-2 rounded-full inline-block hover:bg-slate-600 active:bg-slate-500"
                >
                    <PhArrowLeft size="18" />
                </NuxtLink>

                <h1 class="text-2xl text-white absolute left-1/2 transform -translate-x-1/2">
                    Crie sua conta
                </h1>
          </div>

          <form @submit="onSubmit" class="pt-6 flex flex-col gap-4">
                <div class="flex items-center gap-4">
                    <Input.Root class="w-full">
                        <Input.Label id="name">Nome</Input.Label>
                        <Input.Normal
                            v-bind="nameAttrs"
                            v-model="name"
                            type="text"
                            id="name"
                            placeholder="Seu nome"
                        />
                        <Input.Error v-if="hasErrors.name.show">
                            {{ hasErrors.name.message }}
                        </Input.Error>
                    </Input.Root>

                    <Input.Root class="w-full">
                        <Input.Label id="lastName">Sobrenome</Input.Label>
                        <Input.Normal
                            v-bind="lastNameAttrs"
                            v-model="lastName"
                            type="text"
                            id="lastName"
                            placeholder="Seu sobrenome"
                        />
                        <Input.Error v-if="hasErrors.lastName.show">
                            {{ hasErrors.lastName.message }}
                        </Input.Error>
                    </Input.Root>
                </div>

                <Input.Root>
                    <Input.Label id="email">Email</Input.Label>
                    <Input.Normal
                        v-bind="emailAttrs"
                        v-model="email"
                        type="email"
                        id="email"
                        placeholder="exemplo@dominio.com"
                    />
                    <Input.Error v-if="hasErrors.email.show">
                        {{ hasErrors.email.message }}
                    </Input.Error>
                </Input.Root>

                <Input.Root>
                    <Input.Label id="registerPassword">Senha</Input.Label>
                    <Input.Password
                        v-bind="passwordAttrs"
                        v-model="password"
                        id="registerPassword"
                        placeholder="********"
                    />
                    <Input.Error v-if="hasErrors.password.show">
                        {{ hasErrors.password.message }}
                    </Input.Error>
                </Input.Root>

                <button type="submit">
                    Criar Conta
                </button>
          </form>
    </main>
</template>