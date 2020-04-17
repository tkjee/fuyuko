
import express, {Router} from 'express';
import {Registry} from "../../registry";

// routes
import registerGetHeartbeatRoute from './GET-heartbeat-route';
import registerPostActivateInvirationRoute from './POST-activate-invitation.route';
import registerPostApproveSelfRegistrationRoute from './POST-approve-self-registration.route';
import registerPostCreateInvitationRoute from './POST-create-invitation.route';
import registerGetUserAvatarRoutes from './GET-user-avatar.route';
import registerGetUserAvatarInfoRoutes from './GET-user-avatar-info.route';
import registerGetGlobalAvatarRoute from './GET-global-avatar.route';
import registerGetInvitationByCodeRoute from './GET-invitation-by-code.route';
import registerGetAllGlobalAvatarsRoute from './GET-all-global-avatars.route';
import registerPostLoginRoute from './POST-login.route';
import registerPostLogoutRoute from './POST-logout.route';
import registerPostSelfRegisterRoute from './POST-self-register.route';
import registerPostSaveUserAvatarRoute from './POST-save-user-avatar.route';
import registerPostSaveUserRoute from './POST-save-user.route';
import registerGetUserRoute from './GET-user.route';
import registerGetAllGroupsRoute from './GET-all-groups.route';
import registerGetGroupByIdRoute  from './GET-group-by-id.route';
import registerGetSearchGroupsWithNoSuchRoleRoute from './GET-search-groups-with-no-such-role.route';
import registerGetGroupsWithRoleRoute from './GET-groups-with-role.route';
import registerDeleteRoleFromGroupRoute from './DELETE-role-from-group.route';
import registerPostAddRoleToGroupRoute from './POST-add-role-to-group.route';
import registerPostAddUserToGroupRoute from './POST-add-user-to-group.route';
import registerGetSearchUsersNotInGroupRoute from './GET-search-users-not-in-group.route';
import registerGetUsersInGroupRoute from './GET-users-in-group.route';
import registerDeleteUserFromGroupRoute from './DELETE-user-from-group.route';
import registerGetUsersByStatusRoute from './GET-users-by-status.route';
import registerDeleteUserByIdRoute from './DELETE-user-by-id.route';
import registerPostChangeUserStatusRoute from './POST-change-user-status.route';
import registerGetSelfRegistersRoute from './GET-self-register.route';
import registerDeleteSelfRegisterRoute from './DELETE-self-register.route';
import registerGetAllRolesRoute from './GET-all-roles.route';
import registerGetAllViewsRoute from './GET-all-views.route';
import registerPostSaveViewsRoute from './POST-save-view.route';
import registerDeleteViewsRoute from './DELETE-views.route';
import registerGetAllAttributesByViewRoute from './GET-all-attributes-by-view.route';
import registerGetSearchAllAttributesByViewRoute from './GET-search-attributes-by-view.route';
import registerPostUpdateAttributesRoute from './POST-update-attributes.route';
import registerPostChangeAttributeStatusRoute from './POST-change-attribute-status.route';
import registerGetAllItemsByViewRoute from './GET-all-items-by-view.route';
import registerGetItemImageByIdRoute from './GET-item-image-by-id.route';
import registerGetItemPrimaryImageByItemIdRoute from './GET-item-primary-image.route';
import registerPostUpdateItemRoute from './POST-update-items.route';
import registerPostUpdateItemStatusRoute  from './POST-update-item-status.route';
import registerGetAllRulesByViewRoute from './GET-all-rules-by-view.route';
import registerPostUpdateRuleStatusRoute from './POST-update-rule-status.route';
import registerPostUpdateRulesRoute from './POST-update-rules.route';
import registerGetAllPricingStructuresByViewRoute from './GET-all-pricing-structures.route';
import registerGetAllPricingStructuresWithItemsByViewRoute from './GET-all-pricing-structures-with-items.route';
import registerPostUpdatePricingStructureRoute from './POST-update-pricing-structure.route';
import registerPostUpdatePricingStructureStatusRoute from './POST-update-pricing-structure-status.route';
import registerPostUpdatePricingStructureItemRoute from './POST-update-pricing-structure-item.route';
import registerPostPreviewBulkEditRoute from './POST-preview-bulk-edit.route';
import registerPostScheduleBulkEditRoute from './POST-schedule-bulk-edit.route';
import registerGetAllJobsRoute from './GET-all-jobs.route';
import registerGetJobDetailsByIdRoute from './GET-job-details-by-id.route';
import registerGetJobByIdRoute from './GET-job-by-id.route';
import registerPostPreviewAttributeDataImportRoute from './POST-preview-attribute-data-import.route';
import registerPostPreviewItemDataImportRoute from './POST-preview-item-data-import.route';
import registerPostPreviewPriceDataImportRoute from './POST-preview-price-data-import.route';
import registerPostScheduleAttributeDataImportRoute from './POST-schedule-attribute-data-import.route';
import registerPostScheduleItemDataImportRoute from './POST-schedule-item-data-import.route';
import registerPostSchedulePriceDataImportRoute from './POST-schedule-pricing-data-import.route';
import registerPostPreviewAttributeDataExportRoute from './POST-preview-attribute-data-export.route';
import registerPostPreviewItemDataExportRoute from './POST-preview-item-data-export.route';
import registerPostPreviewPriceDataExportRoute from './POST-preview-price-data-export.route';
import registerPostScheduleAttributeDataExportRoute from './POST-schedule-attribute-data-export.route';
import registerPostScheduleItemDataExportRoute from './POST-schedule-item-data-export.route';
import registerPostSchedulePriceDataExportRoute from './POST-schedule-pricing-data-export.route';
import registerGetExportedFileByIdRoute from './GET-export-file-by-id.route';
import registerPostSaveUserDashboardRoute from './POST-save-user-dashboard.route';
import registerGetUserDashboardRoute from './GET-user-dashboard.route';
import registerPostUserDashboardWidgetDataRoute from './POST-user-dashboard-widget-data.route';
import registerGetUserDashboardWidgetDataRoute from './GET-user-dashboard-widget-data.route';
import registerGetPartnerPricingStructuresRoute from './GET-partner-pricing-structures.route';
import registerGetPartnerPricedItemsRoute from './GET-partner-priced-items-by-pricing-structure.route';
import registerGetSearchForGroupByNameRoute from './GET-search-for-group-by-name.route';
import registerGetSearchUserByUsernameAndStatusRoute from './GET-search-user-by-username-and-status.route';
import registerGetSearchSelfRegistrationByUsernameRoute from './GET-search-self-registrations-by-username.route';
import registerGetRuleByViewRoute from './GET-rule-by-view.route';
import registerGetAttributeByViewRoute from './GET-attribute-by-view.route';
import registerGetItemsByViewRotue from './GET-items-by-view.route';
import registerGetAllViewValidationsRoute from './GET-all-view-validations.route';
import registerGetViewValidationResultRoute from './GET-view-validation-result.route';
import registerPostScheduleValidationRoute from './POST-schedule-validation.route';
import registerGetViewById from './GET-view-by-id.route';
import registerGetUserSettings from './GET-user-settings.route';
import registerPostUserSettings from './POST-user-settings.route';
import registerGetAllCustomRulesRoute from './GET-all-custom-rules.route';
import registerGetAllCustomRulesByViewRoute from './GET-all-custom-rules-by-view.route';
import registerPostAddCustomRuleToViewRoute from './POST-add-custom-rule-to-view.route';
import registerPostChangeCustomRuleStatusRoute from './POST-change-custom-rule-status.route';
import registerPostRemoveCustomRuleFromViewRoute from './DELETE-remove-custom-rule-from-view.route';
import registerGetUserNotificationsRoute from './GET-user-notification.route';
import registerPostUserNotificationRoute from './POST-user-notification.route';
import registerPostAddAttributeRoute from './POST-add-attributes.route';
import registerGetSearchForItemsByViewRoute from './GET-search-for-items-by-view.route';
import registerDeleteValidationResultByIdRoute from './DELETE-validation-result-by-id.route';
import registerGetDataExportContentByIdRoute from './GET-data-export-content-by-id.route';
import registerGetPricingStructureByIdRoute from './GET-pricing-structure-by-id.route';
import registerGetAllDataExportArtifactsRoute from './GET-all-data-export-artifacts.route';
import registerDeleteDataExportArtifactByIdRoute from './DELETE-data-export-artifact-by-id.route';
import registerPostAddItemImageRoute from './POST-add-item-image.route';
import registerDeleteItemImageRoute from './DELETE-item-image-by-id.route';
import registerPostMarkItemImageAsPrimaryRoute from './POST-mark-item-image-as-primary.route';
import registerGetHelpRoute from './GET-help.route';
import registerGetAllCustomImportRoute from './GET-all-custom-import.route';
import registerPostCustomImportValidateInputRoute from './POST-custom-import-validate-input.route';
import registerPostCustomImportPreviewRoute from './POST-custom-import-preview.route';
import registerPostCustomImportSubmitJobRoute from './POST-custom-import-submit-job.route';
import registerGetAllCustomExportRoute from './GET-all-custom-export.route';
import registerPostCustomExportValidateInputRoute from './POST-custom-export-validate-input.route';
import registerPostCustomExportPreviewRoute from './POST-custom-export-preview.route';
import registerPostCustomExportSubmitJobRoute from './POST-custom-export-submit-job.route';
import registerGetPricingStructuresByViewRoute from './GET-pricing-structures-by-view.route';


const v1AppRouter:Router  = express.Router();


const reg = (router: Router, regi: Registry) => {
    const p = '/v1';
    const registry = regi.newRegistry(p);
    router.use(p, v1AppRouter);

    registerGetHeartbeatRoute(v1AppRouter, registry);
    registerPostActivateInvirationRoute(v1AppRouter, registry);
    registerPostApproveSelfRegistrationRoute(v1AppRouter, registry);
    registerPostCreateInvitationRoute(v1AppRouter, registry);
    registerGetUserAvatarRoutes(v1AppRouter, registry);
    registerGetUserAvatarInfoRoutes(v1AppRouter, registry);
    registerGetGlobalAvatarRoute(v1AppRouter, registry);
    registerGetAllGlobalAvatarsRoute(v1AppRouter, registry);
    registerGetInvitationByCodeRoute(v1AppRouter, registry);
    registerPostLoginRoute(v1AppRouter, registry);
    registerPostLogoutRoute(v1AppRouter, registry);
    registerPostSelfRegisterRoute(v1AppRouter, registry);
    registerPostSaveUserAvatarRoute(v1AppRouter, registry);
    registerPostSaveUserRoute(v1AppRouter, registry);
    registerGetUserRoute(v1AppRouter, registry);
    registerGetAllGroupsRoute(v1AppRouter, registry);
    registerGetGroupByIdRoute(v1AppRouter, registry);
    registerGetSearchGroupsWithNoSuchRoleRoute(v1AppRouter, registry);
    registerGetGroupsWithRoleRoute(v1AppRouter, registry);
    registerDeleteRoleFromGroupRoute(v1AppRouter, registry);
    registerPostAddRoleToGroupRoute(v1AppRouter, registry);
    registerGetSearchUsersNotInGroupRoute(v1AppRouter, registry);
    registerGetUsersInGroupRoute(v1AppRouter, registry);
    registerPostAddUserToGroupRoute(v1AppRouter, registry);
    registerDeleteUserFromGroupRoute(v1AppRouter, registry);
    registerGetSelfRegistersRoute(v1AppRouter, registry);
    registerDeleteSelfRegisterRoute(v1AppRouter, registry);
    registerGetUsersByStatusRoute(v1AppRouter, registry);
    registerDeleteUserByIdRoute(v1AppRouter, registry)
    registerPostChangeUserStatusRoute(v1AppRouter, registry);
    registerGetAllRolesRoute(v1AppRouter, registry);
    registerGetAllViewsRoute(v1AppRouter, registry);
    registerPostSaveViewsRoute(v1AppRouter, registry);
    registerDeleteViewsRoute(v1AppRouter, registry);
    registerGetAllAttributesByViewRoute(v1AppRouter, registry);
    registerGetSearchAllAttributesByViewRoute(v1AppRouter, registry);
    registerPostUpdateAttributesRoute(v1AppRouter, registry);
    registerPostChangeAttributeStatusRoute(v1AppRouter, registry);
    registerGetAllItemsByViewRoute(v1AppRouter, registry);
    registerGetItemImageByIdRoute(v1AppRouter, registry);
    registerGetItemPrimaryImageByItemIdRoute(v1AppRouter, registry);
    registerPostUpdateItemRoute(v1AppRouter, registry);
    registerPostUpdateItemStatusRoute(v1AppRouter, registry);
    registerGetAllRulesByViewRoute(v1AppRouter, registry);
    registerPostUpdateRuleStatusRoute(v1AppRouter, registry);
    registerPostUpdateRulesRoute(v1AppRouter, registry);
    registerGetAllPricingStructuresByViewRoute(v1AppRouter, registry);
    registerGetAllPricingStructuresWithItemsByViewRoute(v1AppRouter, registry);
    registerPostUpdatePricingStructureStatusRoute(v1AppRouter, registry);
    registerPostUpdatePricingStructureItemRoute(v1AppRouter, registry);
    registerPostUpdatePricingStructureRoute(v1AppRouter, registry);
    registerPostPreviewBulkEditRoute(v1AppRouter, registry);
    registerPostScheduleBulkEditRoute(v1AppRouter, registry);
    registerGetAllJobsRoute(v1AppRouter, registry);
    registerGetJobDetailsByIdRoute(v1AppRouter, registry);
    registerGetJobByIdRoute(v1AppRouter, registry);
    registerPostScheduleAttributeDataImportRoute(v1AppRouter, registry);
    registerPostScheduleItemDataImportRoute(v1AppRouter, registry);
    registerPostSchedulePriceDataImportRoute(v1AppRouter, registry);
    registerPostPreviewAttributeDataImportRoute(v1AppRouter, registry);
    registerPostPreviewItemDataImportRoute(v1AppRouter, registry);
    registerPostPreviewPriceDataImportRoute(v1AppRouter, registry);
    registerPostPreviewAttributeDataExportRoute(v1AppRouter, registry);
    registerPostPreviewItemDataExportRoute(v1AppRouter, registry);
    registerPostPreviewPriceDataExportRoute(v1AppRouter, registry);
    registerPostScheduleAttributeDataExportRoute(v1AppRouter, registry);
    registerPostScheduleItemDataExportRoute(v1AppRouter, registry);
    registerPostSchedulePriceDataExportRoute(v1AppRouter, registry);
    registerGetExportedFileByIdRoute(v1AppRouter, registry);
    registerPostSaveUserDashboardRoute(v1AppRouter, registry);
    registerGetUserDashboardRoute(v1AppRouter, registry);
    registerPostUserDashboardWidgetDataRoute(v1AppRouter, registry);
    registerGetUserDashboardWidgetDataRoute(v1AppRouter, registry);
    registerGetPartnerPricingStructuresRoute(v1AppRouter, registry);
    registerGetPartnerPricedItemsRoute(v1AppRouter, registry);
    registerGetSearchForGroupByNameRoute(v1AppRouter, registry);
    registerGetSearchUserByUsernameAndStatusRoute(v1AppRouter, registry);
    registerGetSearchSelfRegistrationByUsernameRoute(v1AppRouter, registry);
    registerGetRuleByViewRoute(v1AppRouter, registry);
    registerGetAttributeByViewRoute(v1AppRouter, registry);
    registerGetItemsByViewRotue(v1AppRouter, registry);
    registerGetAllViewValidationsRoute(v1AppRouter, registry);
    registerGetViewValidationResultRoute(v1AppRouter, registry);
    registerPostScheduleValidationRoute(v1AppRouter, registry);
    registerGetViewById(v1AppRouter, registry);
    registerGetUserSettings(v1AppRouter, registry);
    registerPostUserSettings(v1AppRouter, registry);
    registerGetAllCustomRulesRoute(v1AppRouter, registry);
    registerGetAllCustomRulesByViewRoute(v1AppRouter, registry);
    registerPostAddCustomRuleToViewRoute(v1AppRouter, registry);
    registerPostChangeCustomRuleStatusRoute(v1AppRouter, registry);
    registerPostRemoveCustomRuleFromViewRoute(v1AppRouter, registry);
    registerGetUserNotificationsRoute(v1AppRouter, registry);
    registerPostUserNotificationRoute(v1AppRouter, registry);
    registerPostAddAttributeRoute(v1AppRouter, registry);
    registerGetSearchForItemsByViewRoute(v1AppRouter, registry);
    registerDeleteValidationResultByIdRoute(v1AppRouter, registry);
    registerGetDataExportContentByIdRoute(v1AppRouter, registry);
    registerGetPricingStructureByIdRoute(v1AppRouter, registry);
    registerGetAllDataExportArtifactsRoute(v1AppRouter, registry);
    registerDeleteDataExportArtifactByIdRoute(v1AppRouter, registry);
    registerPostAddItemImageRoute(v1AppRouter, registry);
    registerDeleteItemImageRoute(v1AppRouter, registry);
    registerPostMarkItemImageAsPrimaryRoute(v1AppRouter, registry);
    registerGetHelpRoute(v1AppRouter, registry);
    registerGetAllCustomImportRoute(v1AppRouter, registry);
    registerPostCustomImportValidateInputRoute(v1AppRouter, registry);
    registerPostCustomImportPreviewRoute(v1AppRouter, registry);
    registerPostCustomImportSubmitJobRoute(v1AppRouter, registry);
    registerGetAllCustomExportRoute(v1AppRouter, registry);
    registerPostCustomExportValidateInputRoute(v1AppRouter, registry);
    registerPostCustomExportPreviewRoute(v1AppRouter, registry);
    registerPostCustomExportSubmitJobRoute(v1AppRouter, registry);

    registerGetPricingStructuresByViewRoute(v1AppRouter, registry);
};


export default reg;
