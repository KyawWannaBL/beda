# Ops_Manual_Config_Pack_v1.0 parsed content

**Note**: Excel parsing may be incomplete; use the original file for complete analysis

## Sheet: Roles

| role_key | role_name | default_scope |
| --- | --- | --- |
| RDR | Rider | SELF |
| SSR | Substation Rider | SELF |
| DES | Data Entry Staff | BRANCH |
| WH | Warehouse Staff | WAREHOUSE |
| DRV | Driver/Linehaul | SELF |
| SSM | Substation Manager | STATION |
| SUP | Supervisor/Manager | BRANCH |
| FINM | Finance Manager | COMPANY |
| SYS | System Admin | COMPANY |

## Sheet: Permissions

| permission_code | description | module |
| --- | --- | --- |
| TAG-ISSUE | Issue tamper tag batches to riders | Tags |
| TAG-VIEW | View tag inventory and batch status | Tags |
| TAG-VOID-REQ | Request void of a damaged tag | Tags |
| TAG-VOID-APP | Approve/confirm void of a tag | Tags |
| TAG-LOST-MARK | Mark tags as LOST/SUSPECT (block future use) | Tags |
| TAG-EOD-RECON | Submit end-of-day tag reconciliation | Tags |
| TAG-EOD-APP | Approve/close tag reconciliation / close batch | Tags |
| PUP-TT-ASSIGN | Create provisional pickup record by scanning tamper tag | Pickup |
| PUP-PHOTO-CAPTURE | Capture mandatory pickup photos (in-app) | Pickup |
| PUP-QUICK-EDIT | Enter minimal pickup fields (pieces/type/condition/COD flag) | Pickup |
| PUP-EDIT-LIMITED | Edit minimal pickup fields before registration (time-window) | Pickup |
| REG-VIEW-QUEUE | View pending registration queue | Registration |
| REG-FULL-CREATE | Register shipment from tamper tag and generate AWB | Registration |
| REG-FULL-EDIT | Edit non-sensitive registered shipment fields | Registration |
| REG-EDIT-SENSITIVE | Edit sensitive fields (COD/address/phone/service) after registration | Registration |
| LBL-PRINT | Print AWB label after registration | Labeling |
| LBL-REPRINT | Reprint AWB label with reason code | Labeling |
| LBL-ACTIVATE | Activate label after attachment (bind LabelID-AWB-TT) | Labeling |
| LBL-RELABEL | Relabel shipment (new label issuance) | Labeling |
| LOC-SCAN | Scan and validate location QR at nodes | Location |
| WH-GATE-ARRIVAL | Record warehouse gate arrival event | Warehouse |
| WH-RECEIVE | Confirm warehouse receiving and inspection | Warehouse |
| WH-DISPATCH | Create/scan/close dispatch manifests | Warehouse |
| WH-MANIFEST-OVERRIDE | Override manifest mismatch closure (creates incident) | Warehouse |
| SS-RECEIVE | Confirm substation receiving and reconciliation | Substation |
| DLV-OUTFORDELIVERY | Mark parcels out-for-delivery (run dispatch) | Delivery |
| POD-SIGN | Capture customer signature on mobile | POD |
| POD-PHOTO | Capture delivery photo evidence | POD |
| POD-OTP | Send/verify OTP for delivery (optional by policy) | POD |
| NDR-CREATE | Create non-delivery report (delivery failed) | Delivery |
| EXC-CREATE | Create exception/incident record with reason and evidence | Exceptions |
| EXC-RESOLVE | Resolve/close exception case | Exceptions |
| EXC-APPROVE | Approve exception resolution / high-severity overrides | Exceptions |
| AUD-VIEW | View audit logs and event trails | Audit |
| REP-VIEW | View operational reports | Reports |
| REP-EXPORT | Export reports/data (restricted) | Reports |
| ADM-USERS | Manage users | Admin |
| ADM-ROLES | Manage roles and permissions | Admin |
| ADM-CONFIG | Manage system configuration (zones, reasons, policies) | Admin |

## Sheet: RolePermissions

| role_key | permission_code |
| --- | --- |
| RDR | TAG-EOD-RECON |
| RDR | TAG-VOID-REQ |
| RDR | PUP-TT-ASSIGN |
| RDR | PUP-PHOTO-CAPTURE |
| RDR | PUP-QUICK-EDIT |
| RDR | PUP-EDIT-LIMITED |
| RDR | LBL-PRINT |
| RDR | LBL-REPRINT |
| RDR | LBL-ACTIVATE |
| RDR | LOC-SCAN |
| RDR | WH-GATE-ARRIVAL |
| RDR | DLV-OUTFORDELIVERY |
| RDR | POD-SIGN |
| RDR | POD-PHOTO |
| RDR | NDR-CREATE |
| RDR | EXC-CREATE |
| RDR | REP-VIEW |
| SSR | DLV-OUTFORDELIVERY |
| SSR | POD-SIGN |
| SSR | POD-PHOTO |
| SSR | NDR-CREATE |
| SSR | EXC-CREATE |
| SSR | REP-VIEW |
| SSR | LOC-SCAN |
| DES | REG-VIEW-QUEUE |
| DES | REG-FULL-CREATE |
| DES | REG-FULL-EDIT |
| DES | EXC-CREATE |
| DES | REP-VIEW |
| DES | TAG-VIEW |
| WH | LOC-SCAN |
| WH | WH-RECEIVE |
| WH | WH-DISPATCH |
| WH | EXC-CREATE |
| WH | EXC-RESOLVE |
| WH | REP-VIEW |
| WH | TAG-VIEW |
| DRV | LOC-SCAN |
| DRV | EXC-CREATE |
| DRV | REP-VIEW |
| SSM | LOC-SCAN |
| SSM | SS-RECEIVE |
| SSM | EXC-CREATE |
| SSM | EXC-RESOLVE |
| SSM | REP-VIEW |
| SUP | TAG-ISSUE |
| SUP | TAG-VIEW |
| SUP | TAG-VOID-APP |
| SUP | TAG-LOST-MARK |
| SUP | TAG-EOD-APP |
| SUP | REG-EDIT-SENSITIVE |
| SUP | LBL-RELABEL |
| SUP | LBL-REPRINT |
| SUP | WH-MANIFEST-OVERRIDE |
| SUP | EXC-APPROVE |
| SUP | EXC-RESOLVE |
| SUP | AUD-VIEW |
| SUP | REP-VIEW |
| SUP | REP-EXPORT |
| FINM | REG-EDIT-SENSITIVE |
| FINM | EXC-APPROVE |
| FINM | AUD-VIEW |
| FINM | REP-VIEW |
| FINM | REP-EXPORT |
| SYS | TAG-ISSUE |
| SYS | TAG-VIEW |
| SYS | TAG-VOID-REQ |
| SYS | TAG-VOID-APP |
| SYS | TAG-LOST-MARK |
| SYS | TAG-EOD-RECON |
| SYS | TAG-EOD-APP |
| SYS | PUP-TT-ASSIGN |
| SYS | PUP-PHOTO-CAPTURE |
| SYS | PUP-QUICK-EDIT |
| SYS | PUP-EDIT-LIMITED |
| SYS | REG-VIEW-QUEUE |
| SYS | REG-FULL-CREATE |
| SYS | REG-FULL-EDIT |
| SYS | REG-EDIT-SENSITIVE |
| SYS | LBL-PRINT |
| SYS | LBL-REPRINT |
| SYS | LBL-ACTIVATE |
| SYS | LBL-RELABEL |
| SYS | LOC-SCAN |
| SYS | WH-GATE-ARRIVAL |
| SYS | WH-RECEIVE |
| SYS | WH-DISPATCH |
| SYS | WH-MANIFEST-OVERRIDE |
| SYS | SS-RECEIVE |
| SYS | DLV-OUTFORDELIVERY |
| SYS | POD-SIGN |
| SYS | POD-PHOTO |
| SYS | POD-OTP |
| SYS | NDR-CREATE |
| SYS | EXC-CREATE |
| SYS | EXC-RESOLVE |
| SYS | EXC-APPROVE |
| SYS | AUD-VIEW |
| SYS | REP-VIEW |
| SYS | REP-EXPORT |
| SYS | ADM-USERS |
| SYS | ADM-ROLES |
| SYS | ADM-CONFIG |

## Sheet: FieldRules

| role_key | entity | field | phase | can_view | can_edit | can_request_change | notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RDR | Shipment | pieces_count | PRE_REGISTRATION | TRUE | TRUE | FALSE | Editable until office registration submitted. |
| RDR | Shipment | pieces_count | POST_REGISTRATION | TRUE | FALSE | TRUE | Change requires request/approval. |
| RDR | Shipment | parcel_type | PRE_REGISTRATION | TRUE | TRUE | FALSE | Editable until office registration submitted. |
| RDR | Shipment | parcel_type | POST_REGISTRATION | TRUE | FALSE | TRUE | Change requires request/approval. |
| RDR | Shipment | pickup_condition | PRE_REGISTRATION | TRUE | TRUE | FALSE | Editable until office registration submitted. |
| RDR | Shipment | pickup_condition | POST_REGISTRATION | TRUE | FALSE | TRUE | Change requires request/approval. |
| RDR | Shipment | pickup_notes | PRE_REGISTRATION | TRUE | TRUE | FALSE | Editable until office registration submitted. |
| RDR | Shipment | pickup_notes | POST_REGISTRATION | TRUE | FALSE | TRUE | Change requires request/approval. |
| RDR | Shipment | cod_flag | PRE_REGISTRATION | TRUE | TRUE | FALSE | Editable until office registration submitted. |
| RDR | Shipment | cod_flag | POST_REGISTRATION | TRUE | FALSE | TRUE | Change requires request/approval. |
| RDR | Shipment | cod_amount | PRE_REGISTRATION | TRUE | TRUE | FALSE | Editable until office registration submitted. |
| RDR | Shipment | cod_amount | POST_REGISTRATION | TRUE | FALSE | TRUE | Change requires request/approval. |
| RDR | Shipment | destination_township_hint | PRE_REGISTRATION | TRUE | TRUE | FALSE | Editable until office registration submitted. |
| RDR | Shipment | destination_township_hint | POST_REGISTRATION | TRUE | FALSE | TRUE | Change requires request/approval. |
| RDR | Shipment | sender_name | ANY | TRUE | FALSE | FALSE |  |
| RDR | Shipment | sender_phone | ANY | TRUE | FALSE | FALSE |  |
| RDR | Shipment | receiver_name | ANY | TRUE | FALSE | FALSE |  |
| RDR | Shipment | receiver_phone | ANY | TRUE | FALSE | FALSE |  |
| RDR | Shipment | receiver_address | ANY | TRUE | FALSE | FALSE |  |
| RDR | Shipment | service_type | ANY | TRUE | FALSE | FALSE |  |
| RDR | Shipment | weight | ANY | TRUE | FALSE | FALSE |  |
| RDR | Shipment | dimensions | ANY | TRUE | FALSE | FALSE |  |
| RDR | Shipment | label_print_count | ANY | TRUE | FALSE | FALSE |  |
| RDR | Shipment | label_id | ANY | TRUE | FALSE | FALSE |  |
| RDR | Shipment | warehouse_received_pieces | ANY | TRUE | FALSE | FALSE |  |
| RDR | Shipment | warehouse_condition | ANY | TRUE | FALSE | FALSE |  |
| RDR | Shipment | warehouse_damage_photos | ANY | TRUE | FALSE | FALSE |  |
| RDR | Shipment | manifest_id | ANY | TRUE | FALSE | FALSE |  |
| RDR | Shipment | substation_received_pieces | ANY | TRUE | FALSE | FALSE |  |
| RDR | Shipment | pod_recipient_name | POST_REGISTRATION | TRUE | TRUE | FALSE | Delivery/POD fields editable at delivery only. |
| RDR | Shipment | pod_relationship | POST_REGISTRATION | TRUE | TRUE | FALSE | Delivery/POD fields editable at delivery only. |
| RDR | Shipment | pod_signature | POST_REGISTRATION | TRUE | TRUE | FALSE | Delivery/POD fields editable at delivery only. |
| RDR | Shipment | pod_photo | POST_REGISTRATION | TRUE | TRUE | FALSE | Delivery/POD fields editable at delivery only. |
| RDR | Shipment | ndr_reason | POST_REGISTRATION | TRUE | TRUE | FALSE | Delivery/POD fields editable at delivery only. |
| DES | Shipment | pieces_count | ANY | TRUE | TRUE | FALSE |  |
| DES | Shipment | parcel_type | ANY | TRUE | FALSE | FALSE |  |
| DES | Shipment | pickup_condition | ANY | TRUE | FALSE | FALSE |  |
| DES | Shipment | pickup_notes | ANY | TRUE | FALSE | FALSE |  |
| DES | Shipment | cod_flag | ANY | TRUE | TRUE | FALSE |  |
| DES | Shipment | cod_amount | POST_REGISTRATION | TRUE | FALSE | TRUE | Sensitive edit requires approval. |
| DES | Shipment | cod_amount | PRE_REGISTRATION | TRUE | TRUE | FALSE | Editable during registration. |
| DES | Shipment | destination_township_hint | ANY | TRUE | FALSE | FALSE |  |
| DES | Shipment | sender_name | ANY | TRUE | TRUE | FALSE |  |
| DES | Shipment | sender_phone | ANY | TRUE | TRUE | FALSE |  |
| DES | Shipment | receiver_name | ANY | TRUE | TRUE | FALSE |  |
| DES | Shipment | receiver_phone | POST_REGISTRATION | TRUE | FALSE | TRUE | Sensitive edit requires approval. |
| DES | Shipment | receiver_phone | PRE_REGISTRATION | TRUE | TRUE | FALSE | Editable during registration. |
| DES | Shipment | receiver_address | POST_REGISTRATION | TRUE | FALSE | TRUE | Sensitive edit requires approval. |
| DES | Shipment | receiver_address | PRE_REGISTRATION | TRUE | TRUE | FALSE | Editable during registration. |
| DES | Shipment | service_type | POST_REGISTRATION | TRUE | FALSE | TRUE | Sensitive edit requires approval. |
| DES | Shipment | service_type | PRE_REGISTRATION | TRUE | TRUE | FALSE | Editable during registration. |
| DES | Shipment | weight | ANY | TRUE | TRUE | FALSE |  |
| DES | Shipment | dimensions | ANY | TRUE | TRUE | FALSE |  |
| DES | Shipment | label_print_count | ANY | TRUE | FALSE | FALSE |  |
| DES | Shipment | label_id | ANY | TRUE | FALSE | FALSE |  |
| DES | Shipment | warehouse_received_pieces | ANY | TRUE | FALSE | FALSE |  |
| DES | Shipment | warehouse_condition | ANY | TRUE | FALSE | FALSE |  |
| DES | Shipment | warehouse_damage_photos | ANY | TRUE | FALSE | FALSE |  |
| DES | Shipment | manifest_id | ANY | TRUE | FALSE | FALSE |  |
| DES | Shipment | substation_received_pieces | ANY | TRUE | FALSE | FALSE |  |
| DES | Shipment | pod_recipient_name | ANY | TRUE | FALSE | FALSE |  |
| DES | Shipment | pod_relationship | ANY | TRUE | FALSE | FALSE |  |
| DES | Shipment | pod_signature | ANY | TRUE | FALSE | FALSE |  |
| DES | Shipment | pod_photo | ANY | TRUE | FALSE | FALSE |  |
| DES | Shipment | ndr_reason | ANY | TRUE | FALSE | FALSE |  |
| WH | Shipment | pieces_count | ANY | TRUE | FALSE | FALSE |  |
| WH | Shipment | parcel_type | ANY | TRUE | FALSE | FALSE |  |
| WH | Shipment | pickup_condition | ANY | TRUE | FALSE | FALSE |  |
| WH | Shipment | pickup_notes | ANY | TRUE | FALSE | FALSE |  |
| WH | Shipment | cod_flag | ANY | TRUE | FALSE | FALSE |  |
| WH | Shipment | cod_amount | ANY | TRUE | FALSE | FALSE |  |
| WH | Shipment | destination_township_hint | ANY | TRUE | FALSE | FALSE |  |
| WH | Shipment | sender_name | ANY | TRUE | FALSE | FALSE |  |
| WH | Shipment | sender_phone | ANY | TRUE | FALSE | FALSE |  |
| WH | Shipment | receiver_name | ANY | TRUE | FALSE | FALSE |  |
| WH | Shipment | receiver_phone | ANY | TRUE | FALSE | FALSE |  |
| WH | Shipment | receiver_address | ANY | TRUE | FALSE | FALSE |  |
| WH | Shipment | service_type | ANY | TRUE | FALSE | FALSE |  |
| WH | Shipment | weight | ANY | TRUE | FALSE | FALSE |  |
| WH | Shipment | dimensions | ANY | TRUE | FALSE | FALSE |  |
| WH | Shipment | label_print_count | ANY | TRUE | FALSE | FALSE |  |
| WH | Shipment | label_id | ANY | TRUE | FALSE | FALSE |  |
| WH | Shipment | warehouse_received_pieces | ANY | TRUE | TRUE | FALSE |  |
| WH | Shipment | warehouse_condition | ANY | TRUE | TRUE | FALSE |  |
| WH | Shipment | warehouse_damage_photos | ANY | TRUE | TRUE | FALSE |  |
| WH | Shipment | manifest_id | ANY | TRUE | TRUE | FALSE |  |
| WH | Shipment | substation_received_pieces | ANY | TRUE | FALSE | FALSE |  |
| WH | Shipment | pod_recipient_name | ANY | TRUE | FALSE | FALSE |  |
| WH | Shipment | pod_relationship | ANY | TRUE | FALSE | FALSE |  |
| WH | Shipment | pod_signature | ANY | TRUE | FALSE | FALSE |  |
| WH | Shipment | pod_photo | ANY | TRUE | FALSE | FALSE |  |
| WH | Shipment | ndr_reason | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | pieces_count | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | parcel_type | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | pickup_condition | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | pickup_notes | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | cod_flag | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | cod_amount | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | destination_township_hint | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | sender_name | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | sender_phone | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | receiver_name | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | receiver_phone | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | receiver_address | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | service_type | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | weight | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | dimensions | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | label_print_count | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | label_id | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | warehouse_received_pieces | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | warehouse_condition | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | warehouse_damage_photos | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | manifest_id | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | substation_received_pieces | ANY | TRUE | TRUE | FALSE |  |
| SSM | Shipment | pod_recipient_name | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | pod_relationship | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | pod_signature | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | pod_photo | ANY | TRUE | FALSE | FALSE |  |
| SSM | Shipment | ndr_reason | ANY | TRUE | FALSE | FALSE |  |
| SUP | Shipment | pieces_count | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | parcel_type | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | pickup_condition | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | pickup_notes | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | cod_flag | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | cod_amount | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | destination_township_hint | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | sender_name | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | sender_phone | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | receiver_name | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | receiver_phone | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | receiver_address | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | service_type | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | weight | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | dimensions | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | label_print_count | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | label_id | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | warehouse_received_pieces | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | warehouse_condition | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | warehouse_damage_photos | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | manifest_id | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | substation_received_pieces | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | pod_recipient_name | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | pod_relationship | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | pod_signature | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | pod_photo | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | ndr_reason | ANY | TRUE | TRUE | FALSE | Supervisor can edit with audit reason; sensitive actions trigger approvals. |

## Sheet: ExceptionCodebook

| code | category | description | trigger | creator_roles | evidence | severity | sla | owner | escalation | resolution |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TAG_INVALID | TAG | Tamper tag QR not recognized (not issued / out of range). | Scan TT at pickup | RDR | None | S2 | Immediate | SUP | SUP | Use valid issued tag; investigate inventory. |
| TAG_BLOCKED_LOST | TAG | Tamper tag is blocked (marked LOST/SUSPECT). | Scan TT at pickup | RDR | Photo of physical tag (if possible) | S4 | Immediate | SUP | ROM/FINM | Do not accept parcel; open fraud investigation. |
| TAG_ALREADY_USED | TAG | Tamper tag already linked to another parcel record. | Scan TT | RDR | Photo of tag on parcel | S4 | Immediate | SUP | ROM | Stop; hold parcel; investigate duplicate/label swapping. |
| TAG_DAMAGED_VOID_REQ | TAG | Tag damaged/unusable; void request raised. | Before scan / during pickup | RDR | Photo of damaged tag | S1 | Same day | SUP | BMG | Approve void; issue replacement tag. |
| TAG_MISSING_AT_WAREHOUSE | TAG | Tamper tag not present/visible at warehouse receiving. | Warehouse receiving | WH | Photos of parcel surfaces | S4 | Immediate | SUP | ROM | Hold parcel; require supervisor decision and custody review. |
| TAG_EOD_MISMATCH | TAG | End-of-day tag reconciliation mismatch (used/void/remaining). | Rider EOD reconcile | RDR | Supervisor recount optional | S3 | Next business day | SUP | BMG | Investigate missing tags; mark LOST/SUSPECT if unresolved. |
| PHOTO_MISSING | PHOTO | Required pickup photos not completed. | Confirm pickup | RDR | N/A (blocked) | S2 | Immediate | RDR | SUP | Retake required photos in-app. |
| PHOTO_BLUR_TAG_NOT_VISIBLE | PHOTO | Photos captured but tamper tag not legible/visible. | Pickup QA / registration | DES | N/A | S2 | Same day | DES | SUP | Request rider to retake photo if parcel still accessible; otherwise flag for audit. |
| GALLERY_UPLOAD_ATTEMPT | PHOTO | Attempt to upload photo from gallery (policy violation). | Photo capture | SYSTEM | System log | S4 | Immediate | SUP | ROM | Block action; review rider account for misconduct. |
| REG_DUPLICATE_SUSPECT | REGISTRATION | Possible duplicate shipment detected (same receiver phone/address/date). | Submit registration | DES | System comparison | S2 | Same day | DES | SUP | Confirm with merchant/customer; merge/cancel if duplicate. |
| REG_INCOMPLETE_ADDRESS | REGISTRATION | Address missing mandatory elements (township/landmark). | Submit registration | DES | N/A (validation) | S1 | Immediate | DES | None | Complete address before submission. |
| REG_COD_THRESHOLD | REGISTRATION | COD amount exceeds allowed threshold; approval required. | Submit registration | DES | Customer/merchant confirmation | S3 | Same day | FINM | FINM | Approve/adjust COD per policy. |
| REG_SENSITIVE_EDIT_REQUEST | REGISTRATION | Sensitive edit requested after label printed (COD/address/phone/service). | Edit attempt | DES | Reason + supporting proof | S3 | Same day | SUP | FINM (if COD) | Route to approval workflow; log before/after. |
| LABEL_PRINT_TOO_EARLY | LABEL | Attempt to print label before registration is complete. | Print label | RDR | System log | S1 | Immediate | SYSTEM | None | Complete registration first. |
| LABEL_REPRINT_EXCESSIVE | LABEL | Label reprint count exceeded threshold. | Reprint | SYSTEM | Audit logs | S3 | Same day | SUP | BMG | Supervisor review; investigate for label swapping. |
| LABEL_NOT_ACTIVATED | LABEL | Parcel arrives without label activation scan completed. | Warehouse receiving | WH | Photo of label + TT | S3 | Immediate | SUP | BMG | Hold parcel; require rider activation or relabel per policy. |
| LABEL_QR_DAMAGED | LABEL | AWB label QR unreadable/damaged. | Any scan | RDR/WH/SSR | Photo of label | S2 | Same day | SUP | BMG | Relabel using TT verification; activate new label. |
| LABEL_MISMATCH_TT | LABEL | Scanned AWB label does not match TT-linked record. | Activation/receiving | SYSTEM | System log | S4 | Immediate | SUP | ROM | Hold parcel; open fraud investigation. |
| LOC_QR_MISSING | LOCATION | Location QR poster missing/damaged at node. | Location scan | WH/SSM | Photo of location | S2 | 24h | SUP | ROM | Replace poster; temporary supervisor override if needed. |
| GEOFENCE_FAIL | LOCATION | Attempt to record node scan outside geofence. | Node scan | SYSTEM | GPS log | S4 | Immediate | SUP | ROM | Block scan; investigate fake custody event attempt. |
| SCAN_STATUS_NOT_ALLOWED | SCAN | Scan attempted but status transition not allowed. | Any scan | SYSTEM | System log | S2 | Immediate | OPS | SUP | Follow exception flow; do not force status. |
| OFFLINE_TOO_LONG | SCAN | Device stayed offline beyond policy limit; risk of burst upload manipulation. | Sync | SYSTEM | Device telemetry | S3 | Same day | SUP | ROM | Review scans; require explanation; device compliance action. |
| WH_PIECE_MISMATCH | WAREHOUSE | Pieces count mismatch at warehouse receiving. | Receiving inspection | WH | Photos + count record | S4 | Immediate | SUP | ROM | Hold shipment; open missing piece case; assign last custody owner. |
| WH_DAMAGE_FOUND | WAREHOUSE | Damage found at warehouse receiving (not seen at pickup). | Receiving inspection | WH | Mandatory photos | S3 | 2h | SUP | CLM | Create damage case; decide hold/dispatch per policy. |
| WH_RECEIVE_WITHOUT_ACTIVATION_BLOCKED | WAREHOUSE | Warehouse attempted to receive without label activation (blocked). | Receiving | SYSTEM | System log | S2 | Immediate | WH | SUP | Require activation or relabel workflow. |
| MANIFEST_CLOSE_MISMATCH | DISPATCH | Manifest cannot close due to missing parcels. | Close manifest | WH | Manifest list | S4 | Immediate | SUP | ROM | Investigate before dispatch; supervisor override only with incident. |
| MANIFEST_EXTRA_PARCEL | DISPATCH | Extra parcel scanned not in manifest scope. | Loading | WH/DRV | Scan log | S3 | Immediate | WH | SUP | Remove from load; create correct manifest. |
| DISPATCH_BAY_LOC_NOT_SCANNED | DISPATCH | Dispatch attempted without scanning WH_DISPATCH location QR. | Dispatch | SYSTEM | System log | S3 | Immediate | WH | SUP | Require location validation. |
| SS_RECEIVE_SHORTAGE | SUBSTATION | Substation received fewer parcels than manifest. | Substation receive | SSM | Receiving scan list | S4 | Immediate | SUP | ROM | Open discrepancy case; assign custody to last node/driver. |
| SS_RECEIVE_OVERAGE | SUBSTATION | Substation received extra parcels not in manifest. | Substation receive | SSM | Scan list | S3 | Immediate | SUP | ROM | Quarantine extras; route back to warehouse or correct manifest with approval. |
| POD_SIGNATURE_MISSING | POD | Attempt to mark delivered without signature (policy requires signature). | Submit delivered | SYSTEM | N/A (blocked) | S2 | Immediate | SSR | SUP | Capture signature. |
| POD_SIGNATURE_SUSPECT | POD | Signature captured but appears invalid (too short/identical patterns). | POD analytics | SYSTEM | POD metadata | S3 | 48h | SUP | ROM | Audit rider; require OTP/photo for future deliveries. |
| DELIVERY_GPS_OUTLIER | DELIVERY | Delivery recorded far from expected address geofence. | Delivery submit | SYSTEM | GPS log | S3 | 24h | SUP | ROM | Investigate; may require customer confirmation. |
| NDR_EXCESSIVE_ATTEMPTS | DELIVERY | NDR attempts exceeded policy; initiate return. | NDR workflow | SYSTEM | Attempt history | S2 | Same day | CCA/SUP | ROM | Start return flow with approval if required. |
| COD_AMOUNT_MISMATCH | COD | Collected COD amount does not match system COD amount. | COD submission | SYSTEM | Payment record | S4 | Immediate | FINM | FINM | Lock settlement; investigate rider/cashier. |
| COD_NOT_SUBMITTED | COD | COD delivery completed but COD submission not done by rider. | EOD checks | SYSTEM | Delivery vs COD log | S3 | Same day | CSH/SUP | FINM | Force COD submission; investigate. |
| PARCEL_MISSING_IN_NETWORK | LOSS | Parcel missing between custody points. | Reconciliation | SYSTEM | Last custody event | S4 | Immediate | SUP | ROM/CLM | Open loss case; freeze related payouts/settlements if needed. |

## Sheet: UIWording

| channel | screen | element_type | key | text |
| --- | --- | --- | --- | --- |
| Rider | Home | banner | sync_ok | SYNC OK - No pending uploads |
| Rider | Home | banner | offline | OFFLINE MODE - Pending uploads: {n} |
| Rider | Home | banner | eod_required | ACTION REQUIRED - End-of-Day Tag Reconcile Pending |
| Rider | Home | tile | tile_pickups | Pickups |
| Rider | Home | tile | tile_ready_for_label | Ready for Label |
| Rider | Home | tile | tile_warehouse_drop | Warehouse Drop |
| Rider | Home | tile | tile_deliveries | Deliveries |
| Rider | Home | tile | tile_my_tag_batch | My Tag Batch |
| Rider | Home | tile | tile_sync_status | Sync Status |
| Rider | My Tag Batch | label | active_batch | Active Batch: {BatchID} ({FromTT}-{ToTT}) |
| Rider | My Tag Batch | counter | used | Used: {U} |
| Rider | My Tag Batch | counter | voided | Voided: {V} |
| Rider | My Tag Batch | counter | remaining | Remaining: {R} |
| Rider | My Tag Batch | button | void_tag | Void a Tag |
| Rider | My Tag Batch | button | eod_reconcile | End-of-Day Reconcile |
| Rider | Pickups - New Parcel | step | s1 | Step 1: Attach Tamper Tag |
| Rider | Pickups - New Parcel | button | scan_tag | Scan Tag QR |
| Rider | Pickups - New Parcel | toast | tag_assigned | Tag {TT_ID} assigned |
| Rider | Pickups - New Parcel | error | tag_invalid | Tag not valid / blocked / already used |
| Rider | Pickups - New Parcel | button | photo_top | Take Top Photo |
| Rider | Pickups - New Parcel | button | photo_side | Take Side Photo |
| Rider | Pickups - New Parcel | button | photo_close | Take Tag Close-up |
| Rider | Pickups - New Parcel | error | photos_required | All 3 photos are required. |
| Rider | Pickups - New Parcel | error | tag_visible | Tag must be visible in the photo. Retake. |
| Rider | Pickups - New Parcel | field | pieces | Pieces (default 1) |
| Rider | Pickups - New Parcel | field | parcel_type | Parcel Type (Box/Bag/Document/Other) |
| Rider | Pickups - New Parcel | field | condition | Condition (OK/Damaged) |
| Rider | Pickups - New Parcel | field | cod | COD? (Yes/No) + Amount (optional) |
| Rider | Pickups - New Parcel | field | township | Destination Township (optional) |
| Rider | Pickups - New Parcel | button | confirm_pickup | Confirm Pickup |
| Rider | Pickups - New Parcel | toast | pickup_ok | Pickup recorded - Pending registration |
| Rider | Ready for Label | error | print_early | Cannot print. Registration not completed. |
| Rider | Ready for Label | button | confirm_details | Confirm Details |
| Rider | Ready for Label | button | print_label | Print Label |
| Rider | Ready for Label | toast | label_printed | Label printed (Print # {count}) |
| Rider | Ready for Label | button | activate_label | Activate Label |
| Rider | Ready for Label | toast | activated | Label activated - Ready for warehouse drop |
| Rider | Warehouse Drop | button | scan_wh_gate | Scan Warehouse Gate QR |
| Rider | Warehouse Drop | error | geofence_fail | You are outside the warehouse area. Move closer and retry. |
| Rider | Warehouse Drop | button | scan_parcel | Scan Parcel QR |
| Rider | Warehouse Drop | error | label_not_activated | Label not activated. Cannot record warehouse arrival. |
| Rider | Delivery Stop | button | out_for_delivery | Out for Delivery |
| Rider | Delivery Stop | button | deliver | Deliver |
| Rider | Delivery Stop | button | delivery_failed | Delivery Failed |
| Rider | POD | field | recipient_name | Recipient Name (required) |
| Rider | POD | field | relationship | Relationship (Self/Family/Neighbor/Guard/Other) |
| Rider | POD | button | capture_signature | Capture Signature |
| Rider | POD | button | take_photo | Take Photo |
| Rider | POD | button | submit_delivered | Submit Delivered |
| Rider | POD | error | signature_required | Signature required. |
| Rider | POD | toast | delivered_ok | Delivered recorded successfully |
| Office | Pending Registration Queue | button | register_shipment | Register Shipment |
| Office | Registration Form | banner | verify_tt | Verify tamper tag visibility and parcel condition from photos before registering. |
| Office | Registration Form | field | sender_name | Sender Name |
| Office | Registration Form | field | sender_phone | Sender Phone |
| Office | Registration Form | field | receiver_name | Receiver Name |
| Office | Registration Form | field | receiver_phone | Receiver Phone |
| Office | Registration Form | field | receiver_address | Receiver Address |
| Office | Registration Form | field | township | Township |
| Office | Registration Form | field | service_type | Service Type |
| Office | Registration Form | field | cod_amount | COD Amount (if COD) |
| Office | Registration Form | button | validate_address | Validate Address |
| Office | Registration Form | button | save_draft | Save Draft |
| Office | Registration Form | button | submit_registration | Submit Registration |
| Office | Registration Form | toast | registered | Registered. AWB {AWB_NO} generated. Ready for label printing. |
| Warehouse | Receiving | button | scan_loc | Scan Location QR - Receiving Bay |
| Warehouse | Receiving | button | scan_parcel | Scan Parcel QR |
| Warehouse | Receiving | error | need_activation | Cannot receive. Label not activated. |
| Warehouse | Receiving | field | pieces_verified | Pieces Verified (Yes/No) |
| Warehouse | Receiving | field | condition | Condition (OK/Damaged Found) |
| Warehouse | Receiving | field | damage_photo | Damage Photo (required if damaged) |
| Warehouse | Receiving | button | confirm_received | Confirm Received |
| Warehouse | Dispatch | button | create_manifest | Create Manifest |
| Warehouse | Dispatch | button | scan_manifest | Scan Manifest QR |
| Warehouse | Dispatch | button | close_manifest | Close Manifest |
| Warehouse | Dispatch | error | cannot_close | Cannot close manifest: {n} parcels missing. |
| Substation | Receiving | button | scan_loc | Scan Location QR - Substation Receiving |
| Substation | Receiving | button | scan_manifest | Scan Manifest QR |
| Substation | Receiving | button | confirm_received | Confirm Received |