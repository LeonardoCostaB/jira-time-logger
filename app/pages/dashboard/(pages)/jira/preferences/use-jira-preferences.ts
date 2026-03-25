import { toast } from 'vue-sonner';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';

import { type JiraPreferences, JiraPreferencesSchema } from './jira-preferences.schema';

async function useJiraPreferences() {
    const initialValues: JiraPreferences = {
        jiraEmail: '',
        jiraDomain: '',
        jiraApiToken: '',
        jiraIssueKey: '',
        jiraIssueTime: '',
    };

    try {
        const fetchData = await $fetch<{
            companyEmail: string;
            companyDomain: string;
            issueKey: string;
            issueTime: string;
        }>('/api/pvt/jira/preferences');
        if (fetchData) {
            initialValues.jiraEmail = fetchData.companyEmail;
            initialValues.jiraDomain = fetchData.companyDomain;
            initialValues.jiraIssueKey = fetchData.issueKey;
            initialValues.jiraIssueTime = fetchData.issueTime;
        }
    } catch (error) {
        console.error('Error fetching Jira preferences:', error);
    }

    const { handleSubmit, defineField, isSubmitting, errors } = useForm({
        validationSchema: toTypedSchema(JiraPreferencesSchema),
        initialValues: initialValues,
    });

    const onSubmit = handleSubmit(async (values) => {
        try {
            const fetchData = await fetch('/api/pvt/jira/preferences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jiraEmail: values.jiraEmail,
                    jiraDomain: values.jiraDomain,
                    jiraApiToken: values.jiraApiToken,
                    jiraIssueKey: values.jiraIssueKey,
                    jiraIssueTime: values.jiraIssueTime,
                }),
            });

            const data = await fetchData.json();
            if (data?.message) {
                toast.success(data.message);
            }
        } catch (error) {
            console.error('Error saving Jira preferences:', error);
            toast.error('Failed to save Jira preferences. Please try again.');
        }
    });

    return {
        onSubmit,
        defineField,
        isSubmitting,
        errors,
    };
}

export { useJiraPreferences };
