# Exception_Codebook parsed content

**Note**: Excel parsing may be incomplete; use the original file for complete analysis

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