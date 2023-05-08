"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionErrors = exports.ValidationErrors = void 0;
var ValidationErrors;
(function (ValidationErrors) {
    ValidationErrors[ValidationErrors["InvalidFields"] = -32602] = "InvalidFields";
    ValidationErrors[ValidationErrors["SimulateValidation"] = -32500] = "SimulateValidation";
    ValidationErrors[ValidationErrors["SimulatePaymasterValidation"] = -32501] = "SimulatePaymasterValidation";
    ValidationErrors[ValidationErrors["OpcodeValidation"] = -32502] = "OpcodeValidation";
    ValidationErrors[ValidationErrors["ExpiresShortly"] = -32503] = "ExpiresShortly";
    ValidationErrors[ValidationErrors["Reputation"] = -32504] = "Reputation";
    ValidationErrors[ValidationErrors["InsufficientStake"] = -32505] = "InsufficientStake";
    ValidationErrors[ValidationErrors["UnsupportedSignatureAggregator"] = -32506] = "UnsupportedSignatureAggregator";
    ValidationErrors[ValidationErrors["InvalidSignature"] = -32507] = "InvalidSignature";
})(ValidationErrors = exports.ValidationErrors || (exports.ValidationErrors = {}));
var ExecutionErrors;
(function (ExecutionErrors) {
    ExecutionErrors[ExecutionErrors["UserOperationReverted"] = -32521] = "UserOperationReverted";
})(ExecutionErrors = exports.ExecutionErrors || (exports.ExecutionErrors = {}));
//# sourceMappingURL=Types.js.map