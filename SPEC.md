# Morning Dude product spec

## Foundation

Morning Dude is an Expo app using Firebase Authentication and Firestore. The current scaffold includes email/password authentication and private user profiles. The communication review below is planned functionality; Slack and email integrations are not implemented yet.

## Morning communication review

Help the user see conversations that need a response and opportunities worth acting on in one morning review.

### Unanswered Slack

- Review connected workspaces for direct messages, mentions, and followed threads that appear to require the user's reply.
- Use conversation context and subsequent replies to distinguish an unanswered request from an unread message, an informational update, or a conversation already resolved.
- Show the sender, workspace/channel, time received, short summary, why a reply may be needed, and a link to the original conversation.
- Prioritize explicit requests, deadlines, older unanswered messages, and potential work or business opportunities. Label uncertain cases as potentially needing a reply.

### Important email and opportunities

- Review connected inboxes for important messages, including previously read messages that still need action.
- Give special priority to Upwork invitations, client messages, interview requests, offers for jobs or contract positions, recruiter outreach, and other business leads such as prospective clients, referrals, and partnership inquiries.
- Surface other actionable important emails, including existing client requests and time-sensitive commitments.
- Rank by urgency, relevance, and likely opportunity value. Explain why each item was selected; do not assume every Upwork notification or recruiting newsletter is an actionable lead.
- Show sender/company, received time, opportunity category, concise summary, requested next step, and any stated deadline. Include budget, rate, or role details only when present in the source.
- Group messages from the same thread and avoid showing the same opportunity multiple times when it appears across sources.

### Review workflow

- Present a combined prioritized list with filters for Slack, email, and opportunities.
- Let the user open the original message, mark an item reviewed or resolved, dismiss it, or snooze it until a chosen time.
- Keep review status distinct from reply status: reviewing an item does not mean the conversation was answered. New actionable replies can bring a resolved thread back into the queue.
- Preserve review state across sessions and devices for the signed-in user.
- The initial version reviews messages and links to their source. Any future reply drafting or sending requires an explicit user action; the review does not automatically send messages.

### Integration and data requirements

- Connect Slack and email accounts with user-authorized access. Email provider selection remains open; Upwork emails can be reviewed through the connected inbox without a direct Upwork integration.
- Limit Slack review to conversations the connected user can access and provide controls for included workspaces/channels and inboxes.
- Show last successful sync and connection errors so an unavailable source is not presented as having no outstanding messages.
- Keep account tokens in secure backend storage, never in Expo public configuration. Store per-user review state in Firestore with access controls; define retention and disconnection behavior before importing message content.

### Acceptance criteria

1. An unanswered Slack request appears with context and a source link; a reply that resolves it removes its unanswered status after sync.
2. A read but unanswered Upwork invitation or interview request remains eligible for review.
3. A relevant position offer or business lead is highlighted with the reason for its priority and any explicit deadline.
4. Routine notifications do not receive opportunity priority solely because they mention Upwork or jobs.
5. Dismissed and snoozed items retain their state across sessions; a new actionable message can resurface a thread.
6. A disconnected or failed source is visibly marked as unavailable, and users can access only their own imported items and review state.
