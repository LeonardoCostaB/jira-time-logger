<script setup lang="ts">
    import { computed } from 'vue';
    import { PhArrowLeft } from '@phosphor-icons/vue';

    import { Input } from '../../components/input';

    import { useRegister } from './use-register';

    const { onSubmit, defineField, errors } = useRegister();

    const [name, nameAttrs] = defineField('name');
    const [lastName, lastNameAttrs] = defineField('lastName');
    const [email, emailAttrs] = defineField('email');
    const [password, passwordAttrs] = defineField('password');

    const hasErrors = computed(() => {
        return {
            name: {
                show: !!errors.value.name,
                message: errors.value.name,
            },
            lastName: {
                show: !!errors.value.lastName,
                message: errors.value.lastName,
            },
            email: {
                show: !!errors.value.email,
                message: errors.value.email,
            },
            password: {
                show: !!errors.value.password,
                message: errors.value.password,
            },
        };
    });
</script>

<template>
    <main class="mx-auto max-w-lg rounded-2xl bg-slate-800 px-4 py-6 max-sm:mx-4 max-sm:max-w-full">
        <div class="relative flex items-center">
            <NuxtLink
                to="/login"
                class="inline-block rounded-full bg-slate-700 p-2 text-white underline hover:bg-slate-600 active:bg-slate-500"
            >
                <PhArrowLeft size="18" />
            </NuxtLink>

            <h1 class="absolute left-1/2 -translate-x-1/2 transform text-2xl text-white">
                Crie sua conta
            </h1>
        </div>

        <form class="flex flex-col gap-4 pt-6" @submit="onSubmit">
            <div class="flex items-center gap-4">
                <Input.Root id="name" :errors="hasErrors.name.show" class="w-full">
                    <Input.Label id="name">Nome</Input.Label>
                    <Input.Normal
                        v-bind="nameAttrs"
                        v-model="name"
                        type="text"
                        placeholder="Seu nome"
                    />
                    <Input.Error>
                        {{ hasErrors.name.message }}
                    </Input.Error>
                </Input.Root>

                <Input.Root id="lastName" :errors="hasErrors.lastName.show" class="w-full">
                    <Input.Label id="lastName">Sobrenome</Input.Label>
                    <Input.Normal
                        v-bind="lastNameAttrs"
                        v-model="lastName"
                        type="text"
                        placeholder="Seu sobrenome"
                    />
                    <Input.Error>
                        {{ hasErrors.lastName.message }}
                    </Input.Error>
                </Input.Root>
            </div>

            <Input.Root id="email" :errors="hasErrors.email.show">
                <Input.Label id="email">Email</Input.Label>
                <Input.Normal
                    v-bind="emailAttrs"
                    v-model="email"
                    type="email"
                    placeholder="exemplo@dominio.com"
                />
                <Input.Error>
                    {{ hasErrors.email.message }}
                </Input.Error>
            </Input.Root>

            <Input.Root id="registerPassword" :errors="hasErrors.password.show">
                <Input.Label id="registerPassword">Senha</Input.Label>
                <Input.Password v-bind="passwordAttrs" v-model="password" placeholder="********" />
                <Input.Error>
                    {{ hasErrors.password.message }}
                </Input.Error>
            </Input.Root>

            <button type="submit">Criar Conta</button>
        </form>
    </main>
</template>
