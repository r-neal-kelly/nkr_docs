# Glossary

## alias {#_9cb80c36_ce78_4c8f_9744_c3017d0f9806}
An `alias` refers to a standard C++ [type alias, template alias, or a template template alias ad infinitum](https://en.cppreference.com/w/cpp/language/type_alias). Aliases are frequently found in the first [type section](@ref _2680c916_75d0_4b99_8aba_cddbcc0b84e9) of [types](@ref _d5fa5645_f7f9_446a_936d_459b0e0e4982), [templates](@ref _a13ace0b_d5fa_4445_87cc_c6beca57ff12), and [template templates ad infinitum](@ref _fd358de8_6263_4f8f_b928_180781753d09). They are also used to define the [primary entity](@ref _75c3be6c_da45_4652_bf67_513fde1b9a06) of the [identity](@ref _fd6e7324_a83c_4317_a5a8_9edfabfa7fce) for each [interface](@ref _530148d0_cb32_40a7_9288_99cff1c667fe). When aliasing template parameters, thanks to the [label postfix design](@ref _839025a7_339e_4e65_a259_5feacb45ea12), aliases often keep the same [base name](@ref _457a439d_2c16_48e4_9163_1e21aa6b2805) as their respective parameters. In the nkr::cpp namespace, standard C++ types and templates are directly aliased as primary entities for their respective identities.

## base name {#_457a439d_2c16_48e4_9163_1e21aa6b2805}
A `base name` is the left-hand side of a [label](@ref _f2d4e658_c44a_4b89_b00b_35184f78db10) and is frequently repeated among the labels of [entities](@ref _beac6b26_2cf9_4051_99ba_4ae5a39e66ec) of the same [identity](@ref _fd6e7324_a83c_4317_a5a8_9edfabfa7fce), [generic](@ref _90dbd4cc_851e_429c_bae1_b9b4285cb1ee), or [file group](@ref _a76c0f9d_0ab5_41e3_aeea_8a9e66b9a3fa). Like [postfixes](@ref _d28459df_56cd_4fe9_92a7_73c78f2f96f4), base names may be repeated even in the same namespace, but only with different postfixes.

## entity {#_beac6b26_2cf9_4051_99ba_4ae5a39e66ec}
An `entity` is an indivisibly unique subject represented by a uniquely named [label](@ref _f2d4e658_c44a_4b89_b00b_35184f78db10). [Types](@ref _d5fa5645_f7f9_446a_936d_459b0e0e4982), [templates](@ref _a13ace0b_d5fa_4445_87cc_c6beca57ff12), [template templates ad infinitum](@ref _fd358de8_6263_4f8f_b928_180781753d09), [tags](@ref _aa695b0f_e642_4521_928e_5deba76d9bc6), [traits](@ref _a7aaad0a_73cd_4237_92ee_0ea24814c2a7), [interfaces](@ref _530148d0_cb32_40a7_9288_99cff1c667fe), [functions](@ref _fce2f1b3_466d_4f17_9d2f_45e1b2d1c0e5), [methods](@ref _c6831e56_fbb1_445d_b3fc_7b35c60286a5), [files](@ref _8f685d74_eeb0_499a_a597_2eb707d61e69), and more all all entities.

## entity group {#_f2fd9706_47ef_4a9d_bb60_39f7055128ee}

## file {#_8f685d74_eeb0_499a_a597_2eb707d61e69}
A `file` is an [entity](@ref _beac6b26_2cf9_4051_99ba_4ae5a39e66ec) representing an atomically indivisible part of the library, such as a standard C++ header or translation unit. It does not need to be a file type oriented to the C++ language. It can be any file with a unique [label](@ref _f2d4e658_c44a_4b89_b00b_35184f78db10).

## file group {#_a76c0f9d_0ab5_41e3_aeea_8a9e66b9a3fa}

## function {#_fce2f1b3_466d_4f17_9d2f_45e1b2d1c0e5}

## generic {#_90dbd4cc_851e_429c_bae1_b9b4285cb1ee}

## generic trait {#_df1f9c80_7b88_4247_b9b4_1ca3b0bf2d9a}
A `generic trait` is a [trait](@ref _a7aaad0a_73cd_4237_92ee_0ea24814c2a7) used to constrain inputs to **multiple** [identities](@ref _fd6e7324_a83c_4317_a5a8_9edfabfa7fce) which must each satisfy specific qualities defined by the [generic](@ref _90dbd4cc_851e_429c_bae1_b9b4285cb1ee). This is opposed to an [identity trait](@ref _df1f9c80_7b88_4247_b9b4_1ca3b0bf2d9a) which constrains to a **single** identity.

## identity {#_fd6e7324_a83c_4317_a5a8_9edfabfa7fce}
An `identity` is an [entity group](@ref _f2fd9706_47ef_4a9d_bb60_39f7055128ee) relating to a singularly unique [type](@ref _d5fa5645_f7f9_446a_936d_459b0e0e4982), or all [instantiated types](@ref _be26724f_df26_4658_8cab_109d0b853c27) of a singularly unique [template](@ref _a13ace0b_d5fa_4445_87cc_c6beca57ff12) or of a singularly unique [template template ad infinitum](@ref _fd358de8_6263_4f8f_b928_180781753d09). This entity group consists of the [primary entity](@ref _75c3be6c_da45_4652_bf67_513fde1b9a06), one or more [identity traits](@ref _998fbcbf_ece6_455a_9f74_fda2b132fc39), and one or more [identity tags](@ref _00c037ff_572b_4949_94ba_ced07fe26487). All public [types](@ref _d5fa5645_f7f9_446a_936d_459b0e0e4982), [templates](@ref _a13ace0b_d5fa_4445_87cc_c6beca57ff12), [template templates ad infinitum](@ref _fd358de8_6263_4f8f_b928_180781753d09), and [interfaces](@ref _530148d0_cb32_40a7_9288_99cff1c667fe) in @ref nkr have an identity. An identity is distinctly opposed to a [generic](@ref _90dbd4cc_851e_429c_bae1_b9b4285cb1ee) which cannot either be or have an identity.

## identity tag {#_00c037ff_572b_4949_94ba_ced07fe26487}

## identity trait {#_998fbcbf_ece6_455a_9f74_fda2b132fc39}
An `identity trait` is a [trait](@ref _a7aaad0a_73cd_4237_92ee_0ea24814c2a7) used to constrain inputs to a **singular** [identity](@ref _fd6e7324_a83c_4317_a5a8_9edfabfa7fce), which is opposed to a [generic trait](@ref _df1f9c80_7b88_4247_b9b4_1ca3b0bf2d9a) which constrains inputs to **multiple** [identities](@ref _fd6e7324_a83c_4317_a5a8_9edfabfa7fce).

## inner type {#_abf4372e_9ae6_40b6_96cb_60a40ab5896b}

## instantiated type {#_be26724f_df26_4658_8cab_109d0b853c27}

## interface {#_530148d0_cb32_40a7_9288_99cff1c667fe}

## interface implementation {#_e930ffa6_a82e_461e_9bd9_427f2d51d568}

## interface specialization {#_d21a1a63_6ce7_4285_80cb_fb1c7c08c3b7}

## interface trait {#_e0d5f93d_1ba5_4e41_a280_78a557410cc9}

## label {#_f2d4e658_c44a_4b89_b00b_35184f78db10}
A `label` is the result of combining a [base_name](@ref _457a439d_2c16_48e4_9163_1e21aa6b2805), a [postfix](@ref _d28459df_56cd_4fe9_92a7_73c78f2f96f4) and any relative [namespaces](@ref _c479bb40_3d82_43ce_b058_3576494604ad) or directories on disk, in order to uniquely distinguish an [entity](@ref _beac6b26_2cf9_4051_99ba_4ae5a39e66ec) from other entities. Labels are not to be confused with [label labels](@ref _e6b57146_2f9c_4636_a4f8_7b2022688e41) which themselves are entities representing labels.

## label label {#_e6b57146_2f9c_4636_a4f8_7b2022688e41}
A `label label` is a [type](@ref _d5fa5645_f7f9_446a_936d_459b0e0e4982) with a [postfix](@ref _d28459df_56cd_4fe9_92a7_73c78f2f96f4) of `_lb` representing a [label](@ref _f2d4e658_c44a_4b89_b00b_35184f78db10). They are used to describe various [entities](@ref _beac6b26_2cf9_4051_99ba_4ae5a39e66ec) in the [meta-program](@ref _ef6a576b_26d1_4762_b577_3fe83cdee79f) and are frequently found as [inner types](@ref _abf4372e_9ae6_40b6_96cb_60a40ab5896b) of [tags](@ref _aa695b0f_e642_4521_928e_5deba76d9bc6).

## meta-program {#_ef6a576b_26d1_4762_b577_3fe83cdee79f}

## method {#_c6831e56_fbb1_445d_b3fc_7b35c60286a5}

## namespace {#_c479bb40_3d82_43ce_b058_3576494604ad}

## postfix {#_d28459df_56cd_4fe9_92a7_73c78f2f96f4}
A `postfix` is the right-hand side of a [label](@ref _f2d4e658_c44a_4b89_b00b_35184f78db10) and is frequently repeated among the labels of [entities](@ref _beac6b26_2cf9_4051_99ba_4ae5a39e66ec) throughout the entire library. Like [base names](@ref _457a439d_2c16_48e4_9163_1e21aa6b2805), postfixes may be repeated even in the same namespace, but only with different base names. The [label postfix design](@ref _839025a7_339e_4e65_a259_5feacb45ea12) is a critical component to the structure of @ref nkr. [A list of postfixes is available here](@ref _1382824d_0c2f_476c_b433_cf542fd6bdef).

## primary entity {#_75c3be6c_da45_4652_bf67_513fde1b9a06}
A `primary entity` is the most important [entity](@ref _beac6b26_2cf9_4051_99ba_4ae5a39e66ec) in an [entity group](@ref _f2fd9706_47ef_4a9d_bb60_39f7055128ee). Depending on the context, a primary entity may be a [type](@ref _d5fa5645_f7f9_446a_936d_459b0e0e4982), a [template](@ref _a13ace0b_d5fa_4445_87cc_c6beca57ff12), a [template template ad infinitum](@ref _fd358de8_6263_4f8f_b928_180781753d09), a [trait](@ref _a7aaad0a_73cd_4237_92ee_0ea24814c2a7), an [interface](@ref _530148d0_cb32_40a7_9288_99cff1c667fe), a [namespace](@ref _c479bb40_3d82_43ce_b058_3576494604ad), or a [function](@ref _fce2f1b3_466d_4f17_9d2f_45e1b2d1c0e5). The primary entity is always used as the [base name](@ref _457a439d_2c16_48e4_9163_1e21aa6b2805) for each [file group](@ref _a76c0f9d_0ab5_41e3_aeea_8a9e66b9a3fa).

## primary inner type {#_4e605182_03fd_45fe_ad99_66ef95f8af15}

## private namespace {#_31e7e083_2557_4598_b990_1b76deabd5fc}

## public namespace {#_9f3ee03e_8be9_45ed_96d6_ea4a978e1085}

## static function {#_320d56ae_eec3_4d75_8ef3_677f4dd31c82}

## tag {#_aa695b0f_e642_4521_928e_5deba76d9bc6}

## template {#_a13ace0b_d5fa_4445_87cc_c6beca57ff12}

## template template ad infinitum {#_fd358de8_6263_4f8f_b928_180781753d09}

## trait {#_a7aaad0a_73cd_4237_92ee_0ea24814c2a7}
A `trait` is a standard C++20 `concept` used to constrain [types](@ref _d5fa5645_f7f9_446a_936d_459b0e0e4982), [templates](@ref _a13ace0b_d5fa_4445_87cc_c6beca57ff12), and [template templates ad infinitum](@ref _fd358de8_6263_4f8f_b928_180781753d09). There are three kinds of `traits`, namely [identity traits](@ref _998fbcbf_ece6_455a_9f74_fda2b132fc39), [generic traits](@ref _df1f9c80_7b88_4247_b9b4_1ca3b0bf2d9a), and [interface traits](@ref _e0d5f93d_1ba5_4e41_a280_78a557410cc9). Almost every [primary entity](@ref _75c3be6c_da45_4652_bf67_513fde1b9a06) in the library defines at least one trait, and the nkr::generic namespace in particular defines a numerous amount of them. Traits are a first-class citizen in nkr::tr expressions, along with their related [types](@ref _d5fa5645_f7f9_446a_936d_459b0e0e4982), [templates](@ref _a13ace0b_d5fa_4445_87cc_c6beca57ff12), and [tags](@ref _aa695b0f_e642_4521_928e_5deba76d9bc6). All traits end with the `_tr` [postfix](@ref _d28459df_56cd_4fe9_92a7_73c78f2f96f4).

## type {#_d5fa5645_f7f9_446a_936d_459b0e0e4982}

## type section {#_2680c916_75d0_4b99_8aba_cddbcc0b84e9}
A `type section` is an artificial group of similiar [entities](@ref _beac6b26_2cf9_4051_99ba_4ae5a39e66ec) found on [type](@ref _d5fa5645_f7f9_446a_936d_459b0e0e4982), [template](@ref _a13ace0b_d5fa_4445_87cc_c6beca57ff12), and [template template ad infinitum](@ref _fd358de8_6263_4f8f_b928_180781753d09) declarations.
