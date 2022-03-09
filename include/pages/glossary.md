# Glossary

## base name

## generic trait {#_df1f9c80_7b88_4247_b9b4_1ca3b0bf2d9a}

## identity trait {#_998fbcbf_ece6_455a_9f74_fda2b132fc39}
An `identity trait` is a standard C++20 `concept` used to constrain inputs to a unique type or template.

With a type:
@snippet "./docs/src/glossary.cpp" _54c5c7e1_91a3_4d5b_b41d_c158d3b4c573

With a template of type:
@snippet "./docs/src/glossary.cpp" _fbae0c33_830c_4106_8c8d_bcbae9a82433

And with a template of template of type:
@snippet "./docs/src/glossary.cpp" _7e0fe0cd_2eac_4f85_9539_4a1399492ab0

This includes any qualification and/or alias of a type/instantiated type, and any alias of a template. An identity always has the same base name as the type or template it constrains and is never found in the nkr::generic namespace.

An identity is the opposite of a generic.

## instantiated type

## postfix

## tag

## template {#_a13ace0b_d5fa_4445_87cc_c6beca57ff12}

## template template {#_fd358de8_6263_4f8f_b928_180781753d09}

## trait
A `trait` is a standard C++20 `concept` used to constrain [types](@ref _d5fa5645_f7f9_446a_936d_459b0e0e4982), [templates](@ref _a13ace0b_d5fa_4445_87cc_c6beca57ff12), and [template templates](@ref _fd358de8_6263_4f8f_b928_180781753d09) to arbitrary precision. There are two kinds of `traits`, namely [identity traits](@ref _998fbcbf_ece6_455a_9f74_fda2b132fc39) and [generic traits](@ref _df1f9c80_7b88_4247_b9b4_1ca3b0bf2d9a). Almost every type in the library defines traits, and the nkr::generic namespace in particular defines a numerous amount of them.

## type {#_d5fa5645_f7f9_446a_936d_459b0e0e4982}
