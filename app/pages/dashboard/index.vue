<script setup lang="ts">
  import { Input } from '../../components/input'
  import { computed } from 'vue'
  import { useJiraPreferences } from './use-jira-preferences'

  const {
      onSubmit,
      defineField,
      errors
  } = useJiraPreferences()

  const [
    jiraUrl,
    jiraUrlAttrs
  ] = defineField('jiraUrl')

  const [
    jiraEmail,
    jiraEmailAttrs
  ] = defineField('jiraEmail')

  const [
    jiraApiToken,
    jiraApiTokenAttrs
  ] = defineField('jiraApiToken')

  const [
    jiraIssueKey,
    jiraIssueKeyAttrs
  ] = defineField('jiraIssueKey')

  const [
    jiraIssueTime,
    jiraIssueTimeAttrs
  ] = defineField('jiraIssueTime')

  const hasErrors = computed(() => {
      return {
          jiraUrl: {
              show: !!errors.value.jiraUrl,
              message: errors.value.jiraUrl
          },
          jiraEmail: {
              show: !!errors.value.jiraEmail,
              message: errors.value.jiraEmail
          },
          jiraApiToken: {
              show: !!errors.value.jiraApiToken,
              message: errors.value.jiraApiToken
          },
          jiraIssueKey: {
              show: !!errors.value.jiraIssueKey,
              message: errors.value.jiraIssueKey
          },
          jiraIssueTime: {
              show: !!errors.value.jiraIssueTime,
              message: errors.value.jiraIssueTime
          }
      }
  })
</script>

<template>
  <main class="pt-10 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Jira Preferences</h1>
    
    <section>
      <form class="max-w-xl mx-auto p-4 bg-slate-800 rounded-lg" @submit.prevent="onSubmit">
        <Input.Root>
            <Input.Label id="jiraEmail">Seu email no Jira</Input.Label>
            <Input.Normal
                v-bind="jiraEmailAttrs"
                v-model="jiraEmail"
                type="email"
                id="jiraEmail"
                placeholder="exemplo@dominio.com"
                :errors="hasErrors.jiraEmail.show"
            />
            <Input.Error class="block" v-if="hasErrors.jiraEmail.show">
                {{ hasErrors.jiraEmail.message }}
            </Input.Error>
        </Input.Root>

        <Input.Root class="my-6">
          <Input.Label id="jiraApiToken">API Token</Input.Label>
          <Input.Normal
              v-bind="jiraApiTokenAttrs"
              v-model="jiraApiToken"
              type="password"
              id="jiraApiToken"
              placeholder="Digite o seu API Token do Jira"
              :errors="hasErrors.jiraApiToken.show"
          />
          <Input.Error class="block" v-if="hasErrors.jiraApiToken.show">
              {{ hasErrors.jiraApiToken.message }}
          </Input.Error>
        </Input.Root>

        <Input.Root>
          <Input.Label id="jiraIssueKey">Issue Key</Input.Label>
          <Input.Normal
              v-bind="jiraIssueKeyAttrs"
              v-model="jiraIssueKey"
              type="text"
              id="jiraIssueKey"
              placeholder="Digite a Issue Key (ex: PROJ-123)"
              :errors="hasErrors.jiraIssueKey.show"
          />
          <Input.Error class="block" v-if="hasErrors.jiraIssueKey.show">
              {{ hasErrors.jiraIssueKey.message }}
          </Input.Error>
        </Input.Root>
        
        <Input.Root class="my-6">
          <Input.Label id="jiraIssueTime">Issue Time</Input.Label>
          <Input.Normal
              v-bind="jiraIssueTimeAttrs"
              v-model="jiraIssueTime"
              type="text"
              id="jiraIssueTime"
              placeholder="Digite o tempo da Issue (ex: 2h 30m)"
              :errors="hasErrors.jiraIssueTime.show"
          />
          <Input.Error class="block" v-if="hasErrors.jiraIssueTime.show">
              {{ hasErrors.jiraIssueTime.message }}
          </Input.Error>
        </Input.Root>

        <button
          type="submit"
          class="bg-violet-600 w-full p-3 text-white rounded-md"
        >
          Salvar Preferências
        </button>
      </form>
    </section>
  </main>
</template>