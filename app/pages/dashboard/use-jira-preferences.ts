import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';

import { JiraPreferencesSchema } from './jira-preferences.schema';

function useJiraPreferences() {
    const { handleSubmit, defineField, isSubmitting, errors } = useForm({
        validationSchema: toTypedSchema(JiraPreferencesSchema),
        initialValues: {
            // jiraUrl: '',
            jiraEmail: '',
            jiraApiToken: '',
            jiraIssueKey: '',
            jiraIssueTime: '',
        },
    });

    const onSubmit = handleSubmit(async (values) => {
        const fetchData = await fetch('/api/pvt/jira/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // jiraUrl: values.jiraUrl,
                jiraEmail: values.jiraEmail,
                jiraApiToken: values.jiraApiToken,
                jiraIssueKey: values.jiraIssueKey,
                jiraIssueTime: values.jiraIssueTime,
            }),
        });

        const data = await fetchData.json();
        console.log(data);
    });

    return {
        onSubmit,
        defineField,
        isSubmitting,
        errors,
    };
}

export { useJiraPreferences };
