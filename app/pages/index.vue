<script setup lang="ts">
  // import { ref } from 'vue'

  // const email = ref<string>('')
  // const apiToken = ref<string>('')
  // const issueKey = ref<string>('')

  // async function save() {
  //   const data = {
  //     email: email.value,
  //     apiToken: apiToken.value,
  //     issueKey: issueKey.value
  //   }

  //   const fetchData = await fetch('/jira-preferences', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(data)
  //   })

  //   if (fetchData.ok) {
  //     alert('Preferências salvas com sucesso!')
  //   } else {
  //     alert('Erro ao salvar preferências.')
  //   }
  // }
</script>

<template>
  <main class="flex items-center justify-center">
    <div class="flex-1 bg-slate-800 flex flex-col items-center justify-center p-8 gap-6 max-w-4xl">
      <h1 class="text-4xl">Jira Auto Log</h1>
      <p class="text-lg text-center">
        Esta aplicação permite que você registre automaticamente suas atividades no Jira, economizando tempo e esforço. Para começar, faça login ou crie uma conta para configurar suas preferências e conectar sua conta do Jira.
      </p>

      <NuxtLink href="/login" class="bg-slate-600 text-white w-1/2 px-4 py-2 text-center rounded hover:bg-slate-400 text-lg transition-all">
        Fazer Login
      </NuxtLink>

      <NuxtLink href="/criar-conta" class="bg-violet-600 text-white w-1/2 px-4 py-2 text-center rounded hover:bg-violet-400 text-lg transition-all">
        Criar Conta
      </NuxtLink>
    </div>
  </main>
</template>
