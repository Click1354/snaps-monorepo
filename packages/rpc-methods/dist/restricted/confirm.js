"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmBuilder = void 0;
const controllers_1 = require("@metamask/controllers");
const utils_1 = require("@metamask/utils");
const eth_rpc_errors_1 = require("eth-rpc-errors");
const methodName = 'snap_confirm';
/**
 * The specification builder for the `snap_confirm` permission.
 * `snap_confirm` lets the Snap display a confirmation dialog to the user.
 *
 * @param options - The specification builder options.
 * @param options.allowedCaveats - The optional allowed caveats for the permission.
 * @param options.methodHooks - The RPC method hooks needed by the method implementation.
 * @returns The specification for the `snap_confirm` permission.
 */
const specificationBuilder = ({ allowedCaveats = null, methodHooks, }) => {
    return {
        permissionType: controllers_1.PermissionType.RestrictedMethod,
        targetKey: methodName,
        allowedCaveats,
        methodImplementation: getConfirmImplementation(methodHooks),
    };
};
exports.confirmBuilder = Object.freeze({
    targetKey: methodName,
    specificationBuilder,
    methodHooks: {
        showConfirmation: true,
    },
});
/**
 * Builds the method implementation for `snap_confirm`.
 *
 * @param hooks - The RPC method hooks.
 * @param hooks.showConfirmation - A function that shows a confirmation in the MetaMask UI and returns a `boolean` that signals whether the user approved or denied the confirmation.
 * @returns The method implementation which returns `true` if the user approved the confirmation, otherwise `false`.
 */
function getConfirmImplementation({ showConfirmation }) {
    return async function confirmImplementation(args) {
        const { params, context: { origin }, } = args;
        return await showConfirmation(origin, getValidatedParams(params));
    };
}
/**
 * Validates the confirm method `params` and returns them cast to the correct
 * type. Throws if validation fails.
 *
 * @param params - The unvalidated params object from the method request.
 * @returns The validated confirm method parameter object.
 */
function getValidatedParams(params) {
    if (!Array.isArray(params) || !(0, utils_1.isObject)(params[0])) {
        throw eth_rpc_errors_1.ethErrors.rpc.invalidParams({
            message: 'Expected array params with single object.',
        });
    }
    const { prompt, description, textAreaContent } = params[0];
    if (!prompt || typeof prompt !== 'string' || prompt.length > 40) {
        throw eth_rpc_errors_1.ethErrors.rpc.invalidParams({
            message: 'Must specify a non-empty string "prompt" less than 40 characters long.',
        });
    }
    if (description &&
        (typeof description !== 'string' || description.length > 140)) {
        throw eth_rpc_errors_1.ethErrors.rpc.invalidParams({
            message: '"description" must be a string no more than 140 characters long if specified.',
        });
    }
    if (textAreaContent &&
        (typeof textAreaContent !== 'string' || textAreaContent.length > 1800)) {
        throw eth_rpc_errors_1.ethErrors.rpc.invalidParams({
            message: '"textAreaContent" must be a string no more than 1800 characters long if specified.',
        });
    }
    return params[0];
}
//# sourceMappingURL=confirm.js.map