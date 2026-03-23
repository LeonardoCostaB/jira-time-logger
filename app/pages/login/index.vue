<script setup lang="ts">
    import { computed } from 'vue';
    import { PhSpinner } from '@phosphor-icons/vue';

    import { Input } from '../../components/input';

    import { useLogin } from './use-login';

    const { onSubmit, defineField, isSubmitting, errors } = useLogin();

    const [customerEmail, customerEmailAttrs] = defineField('customerEmail');
    const [customerPassword, customerPasswordAttrs] = defineField('customerPassword');

    const hasError = computed(() => {
        return {
            email: {
                show: !!errors.value.customerEmail,
                message: errors.value.customerEmail,
            },
            password: {
                show: !!errors.value.customerPassword,
                message: errors.value.customerPassword,
            },
        };
    });
</script>

<template>
    <main
        class="mx-auto my-auto mt-10 max-w-md rounded-2xl bg-slate-800 px-4 py-6 max-sm:mx-4 max-sm:max-w-full"
    >
        <h1 class="text-center text-2xl text-white">Faça login para continuar</h1>

        <form class="flex flex-col gap-4 pt-6" @submit="onSubmit">
            <Input.Root id="customerEmail" :errors="hasError.email.show">
                <Input.Label id="customerEmail">Email</Input.Label>
                <Input.Normal
                    v-bind="customerEmailAttrs"
                    v-model="customerEmail"
                    type="email"
                    placeholder="exemplo@dominio.com"
                    :errors="hasError.email.show"
                />
                <Input.Error v-if="hasError.email.show" class="block">
                    {{ hasError.email.message }}
                </Input.Error>
            </Input.Root>

            <Input.Root id="customerPassword" :errors="hasError.password.show">
                <Input.Label>Senha</Input.Label>
                <Input.Password
                    v-model="customerPassword"
                    placeholder="********"
                    v-bind="customerPasswordAttrs"
                    :errors="hasError.password.show"
                />
                <Input.Error class="block">
                    {{ hasError.password.message }}
                </Input.Error>
            </Input.Root>

            <button type="submit" class="w-full bg-blue-600 p-2 text-white">
                <PhSpinner v-if="isSubmitting" class="mx-auto animate-spin" size="24" />

                <span v-else>Entrar</span>
            </button>
        </form>

        <NuxtLink to="/criar-conta" class="mt-4 block text-center text-blue-400 underline">
            Não possui uma conta? Registre-se
        </NuxtLink>
    </main>
</template>
