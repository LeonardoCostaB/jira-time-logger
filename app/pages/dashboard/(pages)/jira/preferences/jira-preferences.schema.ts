import z from 'zod';

const JiraPreferencesSchema = z.object({
    // jiraUrl: z.url("Please enter a valid URL"),
    jiraEmail: z.string().email('Please enter a valid email address'),
    jiraDomain: z.string().min(1, 'Domain cannot be empty'),
    jiraApiToken: z.string().min(1, 'API token cannot be empty'),
    jiraIssueKey: z.string().min(1, 'Issue key cannot be empty'),
    jiraIssueTime: z
        .string()
        .regex(/^(\d+h)?\s?(\d+m)?$/, 'Please enter a valid time format (1h, 1h 30m, 30m)'),
});

export type JiraPreferences = z.infer<typeof JiraPreferencesSchema>;

export { JiraPreferencesSchema };
