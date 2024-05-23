export declare type GleapUserProperty = {
    email?: string;
    name?: string;
    phone?: string;
    value?: number;
    plan?: string;
    companyName?: string;
    companyId?: string;
    customData?: {
        [key: string]: string | number;
    };
};
declare type GleapActivationMethod = 'SHAKE' | 'SCREENSHOT';
declare type GleapSdkType = {
    initialize(token: string): void;
    startFeedbackFlow(feedbackFlow: string, showBackButton: boolean): void;
    startBot(botId: string, showBackButton: boolean): void;
    sendSilentCrashReport(description: string, severity: 'LOW' | 'MEDIUM' | 'HIGH'): void;
    sendSilentCrashReportWithExcludeData(description: string, severity: 'LOW' | 'MEDIUM' | 'HIGH', excludeData: {
        customData?: Boolean;
        metaData?: Boolean;
        attachments?: Boolean;
        consoleLog?: Boolean;
        networkLogs?: Boolean;
        customEventLog?: Boolean;
        screenshot?: Boolean;
        replays?: Boolean;
    }): void;
    startConversation(showBackButton: boolean): void;
    startClassicForm(formId: string, showBackButton: boolean): void;
    open(): void;
    openNews(showBackButton: boolean): void;
    openNewsArticle(articleId: string, showBackButton: boolean): void;
    openChecklists(showBackButton: boolean): void;
    openChecklist(checklistId: string, showBackButton: boolean): void;
    startChecklist(outboundId: string, showBackButton: boolean): void;
    openFeatureRequests(showBackButton: boolean): void;
    openHelpCenter(showBackButton: boolean): void;
    openHelpCenterCollection(collectionId: string, showBackButton: boolean): void;
    openHelpCenterArticle(articleId: string, showBackButton: boolean): void;
    searchHelpCenter(term: string, showBackButton: boolean): void;
    close(): void;
    isOpened(): Promise<boolean>;
    identify(userId: string, userProperties: GleapUserProperty): void;
    identifyWithUserHash(userId: string, userProperties: GleapUserProperty, userHash: string): void;
    updateContact(userProperties: GleapUserProperty): void;
    showFeedbackButton(show: boolean): void;
    clearIdentity(): void;
    preFillForm(formData: {
        [key: string]: string;
    }): void;
    setNetworkLogsBlacklist(networkLogBlacklist: string[]): void;
    setNetworkLogPropsToIgnore(networkLogPropsToIgnore: string[]): void;
    setApiUrl(apiUrl: string): void;
    setFrameUrl(frameUrl: string): void;
    attachCustomData(customData: any): void;
    setCustomData(key: string, value: string): void;
    removeCustomDataForKey(key: string): void;
    clearCustomData(): void;
    setDisableInAppNotifications(disableInAppNotifications: boolean): void;
    registerListener(eventType: string, callback: (data?: any) => void): void;
    setLanguage(language: string): void;
    enableDebugConsoleLog(): void;
    disableConsoleLog(): void;
    setTags(tags: string[]): void;
    trackPage(pageName: String): void;
    showSurvey(surveyId: String, format: 'survey' | 'survey_full'): void;
    log(message: string): void;
    logWithLogLevel(message: string, logLevel: 'INFO' | 'WARNING' | 'ERROR'): void;
    logEvent(name: string, data: any): void;
    trackEvent(name: string, data: any): void;
    addAttachment(base64file: string, fileName: string): void;
    removeAllAttachments(): void;
    startNetworkLogging(): void;
    stopNetworkLogging(): void;
    setActivationMethods(activationMethods: GleapActivationMethod[]): void;
    registerCustomAction(customActionCallback: (data: {
        name: string;
    }) => void): void;
    getIdentity(): Promise<any>;
    isUserIdentified(): Promise<boolean>;
    setTicketAttribute(key: string, value: string): void;
    setAiTools(tools: {
        name: string;
        description: string;
        response: string;
        executionType: "auto" | "button";
        parameters: {
            name: string;
            description: string;
            type: "string" | "number" | "boolean";
            required: boolean;
            enums?: string[];
        }[];
    }[]): void;
};
declare const _default: GleapSdkType;
export default _default;
//# sourceMappingURL=index.d.ts.map