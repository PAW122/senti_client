const turn_on_logs = false

const addEventHandlers = (senti) => {
    senti.on('AUTO_MODERATION_RULE_CREATE', eventData => {
        if (turn_on_logs) { console.log('AUTO_MODERATION_RULE_CREATE:', eventData); }
    });

    senti.on('AUTO_MODERATION_RULE_UPDATE', eventData => {
        if (turn_on_logs) { console.log('AUTO_MODERATION_RULE_UPDATE:', eventData); }
    });

    senti.on('AUTO_MODERATION_RULE_DELETE', eventData => {
        if (turn_on_logs) { console.log('AUTO_MODERATION_RULE_DELETE', eventData); }
    });

    senti.on('AUTO_MODERATION_ACTION_EXECUTION', eventData => {
        if (turn_on_logs) { console.log('AUTO_MODERATION_ACTION_EXECUTION', eventData); }
    });

    senti.on('CHANNEL_CREATE', eventData => {
        if (turn_on_logs) { console.log('CHANNEL_CREATE', eventData); }
    });

    senti.on('CHANNEL_UPDATE', eventData => {
        if (turn_on_logs) { console.log('CHANNEL_UPDATE', eventData); }
    });

    senti.on('CHANNEL_DELETE', eventData => {
        if (turn_on_logs) { console.log('CHANNEL_DELETE', eventData); }
    });

    senti.on('CHANNEL_PINS_UPDATE', eventData => {
        if (turn_on_logs) { console.log('CHANNEL_PINS_UPDATE', eventData); }
    });

    senti.on('THREAD_CREATE', eventData => {
        if (turn_on_logs) { console.log('THREAD_CREATE', eventData); }
    });

    senti.on('THREAD_UPDATE', eventData => {
        if (turn_on_logs) { console.log('THREAD_UPDATE', eventData); }
    });

    senti.on('THREAD_DELETE', eventData => {
        if (turn_on_logs) { console.log('THREAD_DELETE', eventData); }
    });

    senti.on('THREAD_LIST_SYNC', eventData => {
        if (turn_on_logs) { console.log('THREAD_LIST_SYNC', eventData); }
    });

    senti.on('THREAD_MEMBER_UPDATE', eventData => {
        if (turn_on_logs) { console.log('THREAD_MEMBER_UPDATE', eventData); }
    });

    senti.on('THREAD_MEMBES_UPDATE', eventData => {
        if (turn_on_logs) { console.log('THREAD_MEMBES_UPDATE', eventData); }
    });


    senti.on('GUILD_CREATE', eventData => {
        if (turn_on_logs) { console.log('GUILD_CREATE', eventData); }
    });

    senti.on('GUILD_UPDATE', eventData => {
        if (turn_on_logs) { console.log('GUILD_UPDATE', eventData); }
    });

    senti.on('GUILD_DELETE', eventData => {
        if (turn_on_logs) { console.log('GUILD_DELETE', eventData); }
    });

    senti.on('GUILD_AUDIT_LOG_ENTRY_CREATE', eventData => {
        if (turn_on_logs) { console.log('GUILD_AUDIT_LOG_ENTRY_CREATE', eventData); }
    });

    senti.on('GUILD_BAN_ADD', eventData => {
        if (turn_on_logs) { console.log('GUILD_BAN_ADD', eventData); }
    });

    senti.on('GUILD_BAN_REMOVE', eventData => {
        if (turn_on_logs) { console.log('GUILD_BAN_REMOVE', eventData); }
    });

    senti.on('GUILD_EMOJIS_UPDATE', eventData => {
        if (turn_on_logs) { console.log('GUILD_EMOJIS_UPDATE', eventData); }
    });


    senti.on('GUILD_STICKERS_UPDATE', eventData => {
        if (turn_on_logs) { console.log('GUILD_STICKERS_UPDATE', eventData); }
    });

    senti.on('GUILD_INTEGRATIONS_UPDATE', eventData => {
        if (turn_on_logs) { console.log('GUILD_INTEGRATIONS_UPDATE', eventData); }
    });

    senti.on('GUILD_MEMBER_ADD', eventData => {
        if (turn_on_logs) { console.log('GUILD_MEMBER_ADD', eventData); }
    });

    senti.on('GUILD_MEMBER_REMOVE', eventData => {
        if (turn_on_logs) { console.log('GUILD_MEMBER_REMOVE', eventData); }
    });

    senti.on('GUILD_MEMBER_UPDATE', eventData => {
        if (turn_on_logs) { console.log('GUILD_MEMBER_UPDATE', eventData); }
    });

    senti.on('GUILD_MEMBERS_CHUNK', eventData => {
        if (turn_on_logs) { console.log('GUILD_MEMBERS_CHUNK', eventData); }
    });

    senti.on('GUILD_ROLE_CREATE', eventData => {
        if (turn_on_logs) { console.log('GUILD_ROLE_CREATE', eventData); }
    });

    senti.on('GUILD_ROLE_UPDATE', eventData => {
        if (turn_on_logs) { console.log('GUILD_ROLE_UPDATE', eventData); }
    });

    senti.on('GUILD_ROLE_DELETE', eventData => {
        if (turn_on_logs) { console.log('GUILD_ROLE_DELETE', eventData); }
    });

    senti.on('GUILD_SCHEDULE_EVENT_CREATE', eventData => {
        if (turn_on_logs) { console.log('GUILD_SCHEDULE_EVENT_CREATE', eventData); }
    });

    senti.on('GUILD_SCHEDULE_EVENT_UPDATE', eventData => {
        if (turn_on_logs) { console.log('GUILD_SCHEDULE_EVENT_UPDATE', eventData); }
    });

    senti.on('GUILD_SCHEDULE_EVENT_DELETE', eventData => {
        if (turn_on_logs) { console.log('GUILD_SCHEDULE_EVENT_DELETE', eventData); }
    });

    senti.on('GUILD_SCHEDULE_EVENT_USER_ADD', eventData => {
        if (turn_on_logs) { console.log('GUILD_SCHEDULE_EVENT_USER_ADD', eventData); }
    });

    senti.on('GUILD_SCHEDULE_EVENT_USER_REMOVE', eventData => {
        if (turn_on_logs) { console.log('GUILD_SCHEDULE_EVENT_USER_REMOVE', eventData); }
    });

    senti.on('INTEGRATION_CREATE', eventData => {
        if (turn_on_logs) { console.log('INTEGRATION_CREATE', eventData); }
    });

    senti.on('INTEGRATION_UPDATE', eventData => {
        if (turn_on_logs) { console.log('INTEGRATION_UPDATE', eventData); }
    });

    senti.on('INTEGRATION_DELETE', eventData => {
        if (turn_on_logs) { console.log('INTEGRATION_DELETE', eventData); }
    });

    senti.on('INTERACTION_CREATE', eventData => {
        if (turn_on_logs) { console.log('INTERACTION_CREATE', eventData); }
    });

    senti.on('INVITE_CREATE', eventData => {
        if (turn_on_logs) { console.log('INVITE_CREATE', eventData); }
    });

    senti.on('INVITE_DELETE', eventData => {
        if (turn_on_logs) { console.log('INVITE_DELETE', eventData); }
    });

    // senti.on('MESSAGE_CREATE', eventData => {
    //     if (turn_on_logs) {console.log('MESSAGE_CREATE', eventData);}
    // });

    senti.on('MESSAGE_UPDATE', eventData => {
        if (turn_on_logs) { console.log('MESSAGE_UPDATE', eventData); }
    });

    senti.on('MESSAGE_DELETE', eventData => {
        if (turn_on_logs) { console.log('MESSAGE_DELETE', eventData); }
    });

    senti.on('MESSAGE_DELETE_BULK', eventData => {
        if (turn_on_logs) { console.log('MESSAGE_DELETE_BULK', eventData); }
    });

    senti.on('MESSAGE_REACTION_ADD', eventData => {
        if (turn_on_logs) { console.log('MESSAGE_REACTION_ADD', eventData); }
    });

    senti.on('MESSAGE_REACTION_REMOVE', eventData => {
        if (turn_on_logs) { console.log('MESSAGE_REACTION_REMOVE', eventData); }
    });

    senti.on('MESSAGE_REACTION_REMOVE_ALL', eventData => {
        if (turn_on_logs) { console.log('MESSAGE_REACTION_REMOVE_ALL', eventData); }
    });

    senti.on('MESSAGE_REACTION_REMOVE_EMOJI', eventData => {
        if (turn_on_logs) { console.log('MESSAGE_REACTION_REMOVE_EMOJI', eventData); }
    });

    senti.on('PRESENCE_UPDATE', eventData => {
        if (turn_on_logs) { console.log('PRESENCE_UPDATE', eventData); }
    });

    senti.on('STAGE_INSTANCE_CREATE', eventData => {
        if (turn_on_logs) { console.log('STAGE_INSTANCE_CREATE', eventData); }
    });

    senti.on('STAGE_INSTANCE_UPDATE', eventData => {
        if (turn_on_logs) { console.log('STAGE_INSTANCE_UPDATE', eventData); }
    });

    senti.on('STAGE_INSTANCE_DELETE', eventData => {
        if (turn_on_logs) { console.log('STAGE_INSTANCE_DELETE', eventData); }
    });

    senti.on('TYPING_START', eventData => {
        if (turn_on_logs) { console.log('TYPING_START', eventData); }
    });

    senti.on('USER_UPDATE', eventData => {
        if (turn_on_logs) { console.log('USER_UPDATE', eventData); }
    });

    senti.on('VOICE_STATE_UPDATE', eventData => {
        if (turn_on_logs) { console.log('VOICE_STATE_UPDATE', eventData); }
    });

    senti.on('VOICE_SERVER_UPDATE', eventData => {
        if (turn_on_logs) { console.log('VOICE_SERVER_UPDATE', eventData); }
    });

    senti.on('WEBHOOKS_UPDATE', eventData => {
        if (turn_on_logs) { console.log('WEBHOOKS_UPDATE', eventData); }
    });

};

module.exports = addEventHandlers;
