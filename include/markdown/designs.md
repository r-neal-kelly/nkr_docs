# Designs

## Primary Inner Type {#_8f6a1988_bbdb_46ba_8746_40c02acda41c}
Most every template type available in the library, regardless of how many parameters it has, contains a `primary inner type`. Usually, it's the first provided argument in the parameter list:

@snippet "./docs/src/designs.cpp" _71d0edc7_85b8_40e5_a79b_4d46a8ff2f08

Primary inner types are usually used for the sake of type constraints, particularly through use of an nkr::tr expression with multiple operands:

@snippet "./docs/src/designs.cpp" _6dffcb91_cf58_4490_9cd2_e39762bab3f0

It should be noted that each template does not need to have the same alias name for the `primary inner type`, nor does it need to reuse the parameter name in the name of its alias:

@snippet "./docs/src/designs.cpp" _61c79cda_e67d_4202_b6de_3f7078ba5f7b

So in order to know what the `primary inner type` is for a particular template instantiation, we need to use nkr::interface::type_i:

@snippet "./docs/src/designs.cpp" _7c1eacd8_f30a_4dd8_80e7_c4e02c2b88a2

Common alias names for a `primary inner type` are `type_t`, `value_t`, and `unit_t`.

---

## The "One Kind of Template Parameter" Principle {#_ab449a60_e674_4d0a_91d9_557ec4c5660c}
A few key points need to be understood before expressing this principle:
    1. Templates can take an large variety of entities as parameters including types, other templates, and literal values.
    2. It is desirable to use templates as parameters in concepts.
    3. Templates can have any number of parameters and so parameter packs must be used in the concept.
    4. Parameter packs require one kind of template parameter and thus different entities cannot be mixed.

With these points in mind, it only makes sense to restrict each individual template to accept only one kind of template argument, whatever that may be. Doing so allows us to statically constrain the use of templates in our functions, types, interfaces, and more. For example, nkr::tr requires that every template used in an expression can only take types and nothing else.

---
