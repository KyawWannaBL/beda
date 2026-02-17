# Field_Level_Authority parsed content

**Note**: Excel parsing may be incomplete; use the original file for complete analysis

| role_key | entity | field | phase | can_view | can_edit | can_request_change | notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RDR | Shipment | pieces_count | PRE_REGISTRATION | True | True | False | Editable until office registration submitted. |
| RDR | Shipment | pieces_count | POST_REGISTRATION | True | False | True | Change requires request/approval. |
| RDR | Shipment | parcel_type | PRE_REGISTRATION | True | True | False | Editable until office registration submitted. |
| RDR | Shipment | parcel_type | POST_REGISTRATION | True | False | True | Change requires request/approval. |
| RDR | Shipment | pickup_condition | PRE_REGISTRATION | True | True | False | Editable until office registration submitted. |
| RDR | Shipment | pickup_condition | POST_REGISTRATION | True | False | True | Change requires request/approval. |
| RDR | Shipment | pickup_notes | PRE_REGISTRATION | True | True | False | Editable until office registration submitted. |
| RDR | Shipment | pickup_notes | POST_REGISTRATION | True | False | True | Change requires request/approval. |
| RDR | Shipment | cod_flag | PRE_REGISTRATION | True | True | False | Editable until office registration submitted. |
| RDR | Shipment | cod_flag | POST_REGISTRATION | True | False | True | Change requires request/approval. |
| RDR | Shipment | cod_amount | PRE_REGISTRATION | True | True | False | Editable until office registration submitted. |
| RDR | Shipment | cod_amount | POST_REGISTRATION | True | False | True | Change requires request/approval. |
| RDR | Shipment | destination_township_hint | PRE_REGISTRATION | True | True | False | Editable until office registration submitted. |
| RDR | Shipment | destination_township_hint | POST_REGISTRATION | True | False | True | Change requires request/approval. |
| RDR | Shipment | sender_name | ANY | True | False | False |  |
| RDR | Shipment | sender_phone | ANY | True | False | False |  |
| RDR | Shipment | receiver_name | ANY | True | False | False |  |
| RDR | Shipment | receiver_phone | ANY | True | False | False |  |
| RDR | Shipment | receiver_address | ANY | True | False | False |  |
| RDR | Shipment | service_type | ANY | True | False | False |  |
| RDR | Shipment | weight | ANY | True | False | False |  |
| RDR | Shipment | dimensions | ANY | True | False | False |  |
| RDR | Shipment | label_print_count | ANY | True | False | False |  |
| RDR | Shipment | label_id | ANY | True | False | False |  |
| RDR | Shipment | warehouse_received_pieces | ANY | True | False | False |  |
| RDR | Shipment | warehouse_condition | ANY | True | False | False |  |
| RDR | Shipment | warehouse_damage_photos | ANY | True | False | False |  |
| RDR | Shipment | manifest_id | ANY | True | False | False |  |
| RDR | Shipment | substation_received_pieces | ANY | True | False | False |  |
| RDR | Shipment | pod_recipient_name | POST_REGISTRATION | True | True | False | Delivery/POD fields editable at delivery only. |
| RDR | Shipment | pod_relationship | POST_REGISTRATION | True | True | False | Delivery/POD fields editable at delivery only. |
| RDR | Shipment | pod_signature | POST_REGISTRATION | True | True | False | Delivery/POD fields editable at delivery only. |
| RDR | Shipment | pod_photo | POST_REGISTRATION | True | True | False | Delivery/POD fields editable at delivery only. |
| RDR | Shipment | ndr_reason | POST_REGISTRATION | True | True | False | Delivery/POD fields editable at delivery only. |
| DES | Shipment | pieces_count | ANY | True | True | False |  |
| DES | Shipment | parcel_type | ANY | True | False | False |  |
| DES | Shipment | pickup_condition | ANY | True | False | False |  |
| DES | Shipment | pickup_notes | ANY | True | False | False |  |
| DES | Shipment | cod_flag | ANY | True | True | False |  |
| DES | Shipment | cod_amount | POST_REGISTRATION | True | False | True | Sensitive edit requires approval. |
| DES | Shipment | cod_amount | PRE_REGISTRATION | True | True | False | Editable during registration. |
| DES | Shipment | destination_township_hint | ANY | True | False | False |  |
| DES | Shipment | sender_name | ANY | True | True | False |  |
| DES | Shipment | sender_phone | ANY | True | True | False |  |
| DES | Shipment | receiver_name | ANY | True | True | False |  |
| DES | Shipment | receiver_phone | POST_REGISTRATION | True | False | True | Sensitive edit requires approval. |
| DES | Shipment | receiver_phone | PRE_REGISTRATION | True | True | False | Editable during registration. |
| DES | Shipment | receiver_address | POST_REGISTRATION | True | False | True | Sensitive edit requires approval. |
| DES | Shipment | receiver_address | PRE_REGISTRATION | True | True | False | Editable during registration. |
| DES | Shipment | service_type | POST_REGISTRATION | True | False | True | Sensitive edit requires approval. |
| DES | Shipment | service_type | PRE_REGISTRATION | True | True | False | Editable during registration. |
| DES | Shipment | weight | ANY | True | True | False |  |
| DES | Shipment | dimensions | ANY | True | True | False |  |
| DES | Shipment | label_print_count | ANY | True | False | False |  |
| DES | Shipment | label_id | ANY | True | False | False |  |
| DES | Shipment | warehouse_received_pieces | ANY | True | False | False |  |
| DES | Shipment | warehouse_condition | ANY | True | False | False |  |
| DES | Shipment | warehouse_damage_photos | ANY | True | False | False |  |
| DES | Shipment | manifest_id | ANY | True | False | False |  |
| DES | Shipment | substation_received_pieces | ANY | True | False | False |  |
| DES | Shipment | pod_recipient_name | ANY | True | False | False |  |
| DES | Shipment | pod_relationship | ANY | True | False | False |  |
| DES | Shipment | pod_signature | ANY | True | False | False |  |
| DES | Shipment | pod_photo | ANY | True | False | False |  |
| DES | Shipment | ndr_reason | ANY | True | False | False |  |
| WH | Shipment | pieces_count | ANY | True | False | False |  |
| WH | Shipment | parcel_type | ANY | True | False | False |  |
| WH | Shipment | pickup_condition | ANY | True | False | False |  |
| WH | Shipment | pickup_notes | ANY | True | False | False |  |
| WH | Shipment | cod_flag | ANY | True | False | False |  |
| WH | Shipment | cod_amount | ANY | True | False | False |  |
| WH | Shipment | destination_township_hint | ANY | True | False | False |  |
| WH | Shipment | sender_name | ANY | True | False | False |  |
| WH | Shipment | sender_phone | ANY | True | False | False |  |
| WH | Shipment | receiver_name | ANY | True | False | False |  |
| WH | Shipment | receiver_phone | ANY | True | False | False |  |
| WH | Shipment | receiver_address | ANY | True | False | False |  |
| WH | Shipment | service_type | ANY | True | False | False |  |
| WH | Shipment | weight | ANY | True | False | False |  |
| WH | Shipment | dimensions | ANY | True | False | False |  |
| WH | Shipment | label_print_count | ANY | True | False | False |  |
| WH | Shipment | label_id | ANY | True | False | False |  |
| WH | Shipment | warehouse_received_pieces | ANY | True | True | False |  |
| WH | Shipment | warehouse_condition | ANY | True | True | False |  |
| WH | Shipment | warehouse_damage_photos | ANY | True | True | False |  |
| WH | Shipment | manifest_id | ANY | True | True | False |  |
| WH | Shipment | substation_received_pieces | ANY | True | False | False |  |
| WH | Shipment | pod_recipient_name | ANY | True | False | False |  |
| WH | Shipment | pod_relationship | ANY | True | False | False |  |
| WH | Shipment | pod_signature | ANY | True | False | False |  |
| WH | Shipment | pod_photo | ANY | True | False | False |  |
| WH | Shipment | ndr_reason | ANY | True | False | False |  |
| SSM | Shipment | pieces_count | ANY | True | False | False |  |
| SSM | Shipment | parcel_type | ANY | True | False | False |  |
| SSM | Shipment | pickup_condition | ANY | True | False | False |  |
| SSM | Shipment | pickup_notes | ANY | True | False | False |  |
| SSM | Shipment | cod_flag | ANY | True | False | False |  |
| SSM | Shipment | cod_amount | ANY | True | False | False |  |
| SSM | Shipment | destination_township_hint | ANY | True | False | False |  |
| SSM | Shipment | sender_name | ANY | True | False | False |  |
| SSM | Shipment | sender_phone | ANY | True | False | False |  |
| SSM | Shipment | receiver_name | ANY | True | False | False |  |
| SSM | Shipment | receiver_phone | ANY | True | False | False |  |
| SSM | Shipment | receiver_address | ANY | True | False | False |  |
| SSM | Shipment | service_type | ANY | True | False | False |  |
| SSM | Shipment | weight | ANY | True | False | False |  |
| SSM | Shipment | dimensions | ANY | True | False | False |  |
| SSM | Shipment | label_print_count | ANY | True | False | False |  |
| SSM | Shipment | label_id | ANY | True | False | False |  |
| SSM | Shipment | warehouse_received_pieces | ANY | True | False | False |  |
| SSM | Shipment | warehouse_condition | ANY | True | False | False |  |
| SSM | Shipment | warehouse_damage_photos | ANY | True | False | False |  |
| SSM | Shipment | manifest_id | ANY | True | False | False |  |
| SSM | Shipment | substation_received_pieces | ANY | True | True | False |  |
| SSM | Shipment | pod_recipient_name | ANY | True | False | False |  |
| SSM | Shipment | pod_relationship | ANY | True | False | False |  |
| SSM | Shipment | pod_signature | ANY | True | False | False |  |
| SSM | Shipment | pod_photo | ANY | True | False | False |  |
| SSM | Shipment | ndr_reason | ANY | True | False | False |  |
| SUP | Shipment | pieces_count | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | parcel_type | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | pickup_condition | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | pickup_notes | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | cod_flag | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | cod_amount | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | destination_township_hint | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | sender_name | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | sender_phone | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | receiver_name | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | receiver_phone | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | receiver_address | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | service_type | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | weight | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | dimensions | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | label_print_count | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | label_id | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | warehouse_received_pieces | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | warehouse_condition | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | warehouse_damage_photos | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | manifest_id | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | substation_received_pieces | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | pod_recipient_name | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | pod_relationship | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | pod_signature | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | pod_photo | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |
| SUP | Shipment | ndr_reason | ANY | True | True | False | Supervisor can edit with audit reason; sensitive actions trigger approvals. |