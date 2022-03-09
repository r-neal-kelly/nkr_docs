# Styles
(W.I.P)

We need to hook up these styles to the test suites to keep them updated as some of these are outdated.

### Names
__________

Snake case is used for all names. Names are intended to follow natural grammars such that they are more easily discerned when trying to understand any particular piece of code. Thus short names, especially single character names, are usually unacceptable (with some exceptions). Descriptive names are the key to understanding code, however short postfix notation is sometimes employed to indicate differences between types of objects but especially to avoid name collisions.

- **Namespaces**: *lower_case*. Short names are encouraged but not required. On occasion a namespace may contain a label with a postfix such as a type name:

    ```cpp
    namespace nkr {



    }

    namespace nkr { namespace test_type_t {



    }}
    ```

- **Classes (Types)**: *lower_case*, *_t postfix*. These should usually be named after nouns:

    ```cpp
    namespace nkr {

        class class_t
        {
        };

        template <typename = void_t>
        class template_t
        {
        };
    }
    ```

- **Unions**: *lower_case*, *_u postfix*. These should usually be named after nouns indicating the commonality between its types:

    ```cpp
    namespace nkr {

        union unsigned_integer_u
        {
            u8_t    u8;
            u16_t   u16;
            u32_t   u32;
            u64_t   u64;
        };

    }
    ```

- **Template Parameters**: *lower_case*, *_p postfix*. These are effectively meta variables and thus do not have the type postfix:

    ```cpp
    namespace nkr {

        template <typename template_parameter_p>
        class template_t
        {
        };

    }
    ```

- **Aliased Types**: *lower_case*, *_t postfix*. The same as regular types. Notice how the _p postfix for type parameters makes aliasing the same name easy:

    ```cpp
    namespace nkr {

        template <typename template_parameter_p>
        class template_t
        {
        public:
            using template_parameter_t = template_parameter_p;
        };

    }
    ```

- **Traits (Concepts Refining Template Parameters)**: *lower_case*, *_tr postfix*. These are effectively meta types and thus have a postfix, albeit distinct from regular types. These should usually be named after adjectives:

    ```cpp
    namespace nkr {

        template <typename type_p>
        concept describable_tr = true;

        template <describable_tr template_parameter_p>
        class template_t
        {
        };

    }
    ```

- **Functions**: *Upper_Case*. Functions should usually be named after verbs. There may be rare occasions where other type labels are included in a function name, and they too should be written in lower case, with the postfix remaining lower case:

    ```cpp
    namespace nkr {

        void_t  Do_Function();

        template <typename = void_t>
        void_t  Do_Template_Function();

        void_t  Do_Type_t_Function();

    }
    ```

- **Function Acronyms and Idioms**: *CAPITAL_CASE*. When a function name has an acronym, it should be in all caps. Special idiomatic expressions may also be in all caps:

    ```cpp
    namespace nkr {

        void_t  Do_CPP();   // a 'C Plus Plus' oriented function

        void_t  Do_XOR();   // a logical XOR operation

    }
    ```

- **Methods**: *Upper_Case*. Methods should usually be named after verbs except if they are a getter or a setter, in whice case they can simply be the capitalized name of the data member:

    ```cpp
    namespace nkr {

        class class_t
        {
        private:
            u64_t   data;

        public:
            class_t():
                data(0)
            {
            }

        public:
            void_t Do_Method()
            {
            }

        #if defined(nkr_SIMPLE_GETTER_SETTER)
            u64_t& Data()
            {
                return this->data;
            }
        #elif defined(nkr_COMPLEX_GETTER_SETTER)
            u64_t Data() const
            {
                return this->data;
            }

            void_t Data(u64_t data)
            {
                this->data = data;
            }
        #endif
        };

    }
    ```

- **Pointer to Function or Method**: *Upper_Case*. These are exactly the same as their Function and Method counter-parts:

    ```cpp
    namespace nkr {

        class class_t
        {
        public:
            static void_t Do_Function()
            {
            }
        public:
            void_t Do_Method()
            {
            }
        };

        void Do()
        {
            void (*Do_Function)()           = &class_t::Do_Function;
            void (class_t::*Do_Method)()    = &class_t::Do_Method;

            Do_Function();
            (class_t().*Do_Method)();
        }

    }
    ```

- **Interfaces**: *lower_case*, *_i postfix*. Whether C++20 concepts defined by requires-expressions, abstract virtual classes, structs of function pointers, or anything else that genuinely qualifies as an interface:

    ```cpp
    namespace nkr {

        template <typename type_p>
        concept concept_i = requires(type_p value)
        {
            { value.Method() } -> std::same_as<void_t>;
        };

        class virtual_i
        {
        public:
            virtual ~virtual_i()    = default;

        public:
            virtual void_t  Method()    = 0;
        };

        struct struct_i
        {
        public:
            void_t  (*Method)();
        };

    }
    ```

- **Variables**: *lower_case*:

    ```cpp
    namespace nkr {

        count_t variable;

    }
    ```

- **Constants**: *lower_case*:

    ```cpp
    namespace nkr {

        const bool_t constant = true;

    }
    ```

- **Constexprs**: *CAPITAL_CASE*:

    ```cpp
    namespace nkr {

        constexpr const bool_t CONSTANT = true;

    }
    ```

- **Enums**: *CAPITAL_CASE*.

    ```cpp
    namespace nkr {

        enum : u8_t
        {
            ENUM,
        };

    }
    ```

- **Enum Types**: *lower_case*, *_e postfix*.

    ```cpp
    namespace nkr {

        enum c_type_e : u8_t
        {
        };

        enum class cpp_type_e : u8_t
        {
        };

        class nkr_type_e :
            public enum_t<u8_t>
        {
            enum : u8_t
            {
            };
        };

    }
    ```

- **Macros**: *CAPITAL_CASE*, *nkr_ prefix*. In order to not pollute the namespace, every single macro without exception shall be prefixed with the name of the library:

    ```cpp
    namespace nkr {

    #define nkr_HAS_MACRO true

        constexpr const bool_t HAS_MACRO = nkr_HAS_MACRO;

    #undef nkr_HAS_MACRO

    }
    ```

- **Macro Parameters**: *CAPITAL_CASE*, *_p postfix*:

    ```cpp
    namespace nkr {

    #define nkr_DO_MACRO(MACRO_PARAMETER_p) \
    nkr_M                                   \
        (MACRO_PARAMETER_p);                \
    nkr_W

        nkr_DO_MACRO(0);

    #undef nkr_DO_MACRO

    }
    ```

- **Collisions**: On occasion there will be name collisions with lower case labels and keywords. In those instances, it is recommended to postfix a *$* before the label name:

    ```cpp
    namespace nkr { namespace static$ {

        class type_t
        {
        public:
            word_t operator$;
        };

    }}
    ```

### Namespaces
______________

- Namespaces should always have a space after their opening brace and before their closing brace, and at least a third line, either of code or space:

    ```cpp
    namespace nkr {

        // either a space or something else has to be here.

    }

    namespace nkr {

            

    }
    ```

- Nested namespaces must be on one line, and so namespaces should end up only having one indentation. When working with multiple namespaces, each namespace should have its own block:

    ```cpp
    namespace nkr { namespace a {



    }}

    namespace nkr { namespace a { namespace b {



    }}}
    ```
