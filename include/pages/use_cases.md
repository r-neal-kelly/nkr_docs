# Use-Cases

## nkr::tr

### Dynamically Define Concepts In-Place

Let's take a concrete example. What if we wanted to have a function that takes two `std::vectors` and combines them? We do not care what their `value_types` are, only that the second one has a `value_type` statically convertible to the other. Let's put together a simple algorithm and not worry about exceptions and other validations:

@snippet "./tr/src/tr.cpp" _1eb89575_6738_4a9f_970d_ec9694d4b9d7

It works as expected, but only when we give it valid inputs. So how can we take advantage of C++20 concepts to improve the user-experience? We ought to give them better compiler errors than this one:

@snippet "./tr/src/tr.cpp" _67458ff6_c7f5_46e6_b24e_24f4c565ab62

Actually, it might be tempting to change our algorithm so that `std::forward_list` will work too, but we want the algorithm that we have because it will be more performant with vectors and their `reserve` method. Maybe in the future we can add an overload for `std::forward_list` but for now we just want `std::vectors`. How about we try some duck-typing?:

@snippet "./tr/src/tr.cpp" _69e2f254_d945_4a7b_a8f1_09264cd66821

Works perfectly! Now the user cannot get a weird compiler message when they pass in a wrong type.

Right?:

@snippet "./tr/src/tr.cpp" _80ac1030_b280_42c4_9c4f_e70b43e05f11

We surely need to react better for our user. Even if it seems like an edge case, we can never be too sure what our users will do:

@snippet "./tr/src/tr.cpp" _33593243_fddd_4839_b95d_32f1ef8aba3b

Something more than duck-typing has to be done. We could add more method checks but the problem still remains, it cannot guarantee that our user will pass a `std::vector`. Well, there must a way to constrain to a `std::vector` without constraining to its `value_type`. Actually there's more than one way to do it:

@snippet "./tr/src/tr.cpp" _d244a6f8_6154_41f6_8a41_f8eba234289b

And here's a more concept-focused way:

@snippet "./tr/src/tr.cpp" _d87f347d_24a8_43f9_a87a_e0ec26b25bd6

As we can see they will both function correctly, but there's a couple of problems:

@snippet "./tr/src/tr.cpp" _f3feb95c_c2e0_47f9_9bbb_0ddae4e4de2e

While it's true that we want non-const `std::vectors` for our function, that is certainly not always going to be the case. Sometimes we actually want const and sometimes we may even want volatile types. Another issue is that it's not great having specific use-case concepts just laying about like this. In fact, it's really not great having concepts outside of our function at all. At the end of the day, we're not really interested in adding concepts to our code that will function in other contexts. We really just want our function to behave in a certain way. What we really want is to **dynamically define concepts in place**. Dynamic because we want to clarify qualification as well as type, and in place because we really just want it private to our particular function. And so we have nkr::tr:

@snippet "./tr/src/tr.cpp" _bdba9807_d875_4e5f_8b01_66662833310d

There's just one thing missing. Let's add another private and dynamically defined in-place concept within our function body, to make sure that the inner types of the `std::vectors` are convertible:

@snippet "./tr/src/tr.cpp" _9728b2d9_8986_46b7_b27b_a0d777cf2c90
