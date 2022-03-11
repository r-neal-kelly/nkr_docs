/*
    Copyright 2022 r-neal-kelly
*/

`use strict`;

const /* object_t */ fs     = require(`fs`);
const /* object_t */ path   = require(`path`);

const /* string_t */ help_message = `
Info:

    This program will normalize the indentation of code examples in doxygen generated html files.
    Works with doxygen version 1.9.3.

Parameter #1:

    relative or absolute path, e.g. "./docs":
        Must be the folder doxygen generates its html files in.
        All html files must be in the same folder.
        Will not work with the doxygen option to separate files into multiple directories.
    
    "-h" or "--help" or (none):
        Displays this message in the terminal.
`;

/* string_t[] */ async function Read_Directory(directory_path)
{
    return new Promise(function (/* function_t */ Resolve, /* function_t */ Reject) {
        fs.readdir(directory_path, function (/* error_t */ error, /* string_t[] */ files) {
            if (error) {
                Reject(error);
            } else {
                Resolve(files);
            }
        });
    });
}

/* string_t */ async function Read_File(/* string_t */ path_to_file)
{
    return new Promise(function (/* function_t */ Resolve, /* function_t */ Reject) {
        fs.readFile(path_to_file, `utf8`, function (/* error_t */ error, /* string_t */ file_text) {
            if (error) {
                Reject(error);
            } else {
                Resolve(file_text);
            }
        });
    });
}

/* void_t */ async function Write_File(/* string_t */ path_to_file, /* string_t */ file_text)
{
    return new Promise(function (/* function_t */ Resolve, /* function_t */ Reject) {
        fs.writeFile(path_to_file, file_text, `utf8`, function (/* error_t */ error) {
            if (error) {
                Reject(error);
            } else {
                Resolve();
            }
        });
    });
}

/* string_t */ function Normalize_File_Text(/* string_t */ file_text)
{
    const /* regex_t */ fragment_regex = /(?<=<div class="fragment">).*?(?=<\/div><!-- fragment -->)/gs;
    const /* regex_t */ preprocessor_and_space_regex = /<span class="preprocessor">( +)/g;
    const /* regex_t */ normalized_line_regex = /(?<=<div class="line">)[^ ]/;
    const /* regex_t */ line_indent_regex = /(?<=<div class="line">)  +/g;

    const /* string_t */ preprocessor_tag = `<span class="preprocessor">`;
    const /* string_t */ line_tag = `<div class="line">`;

    let fragments = [];

    file_text = file_text.replace(preprocessor_and_space_regex, `$1${preprocessor_tag}`);

    let match;
    while ((match = fragment_regex.exec(file_text)) !== null) {
        if (!normalized_line_regex.test(match[0])) {
            let fragment = {};
    
            fragment.text = match[0];
            fragment.first = match.index;
            fragment.end = match.index + match[0].length;
            fragments.push(fragment);
    
            let line_indents = fragment.text.match(line_indent_regex);
            if (line_indents !== null) {
                let min_space_count = Math.min(...line_indents.map(value => value.length));
                fragment.text = fragment.text.replace(new RegExp(line_tag + ' '.repeat(min_space_count), "g"), line_tag);
            }
        }
    }

    for (let idx = fragments.length - 1; idx >= 0; idx -= 1) {
        let fragment = fragments[idx];
    
        let back = file_text.substring(fragment.end, file_text.length);
        let front = file_text.substring(0, fragment.first);

        file_text = front + fragment.text + back;
    }

    return file_text;
}

(/* void_t */ async function Main()
{
    const /* string_t[] */ arguments = process.argv.slice(2);

    if (arguments[0] == `-h` || arguments[0] == `--help` || arguments[0] == null) {
        console.log(help_message);
    } else {
        const /* string_t */ path_to_docs = path.resolve(arguments[0]);

        try {
            let html_files = (await Read_Directory(path_to_docs)).filter(/* string_t */ value => /\.html/.test(value));
    
            for (let html_file of html_files) {
                try {
                    let file_text = await Read_File(`${path_to_docs}/${html_file}`);
                    let normalized_file_text = Normalize_File_Text(file_text);
                    try {
                        await Write_File(`${path_to_docs}/${html_file}`, normalized_file_text);
                    } catch (error) {
                        console.log(`\n`);
                        console.log(`failed to write html file: ${html_file}`);
                        console.log(error);
                        console.log(`\n`);
                    }
                } catch (error) {
                    console.log(`\n`);
                    console.log(`failed to read html file: ${html_file}`);
                    console.log(error);
                    console.log(`\n`);
                }
            }
        } catch(error) {
            console.log(`\n`);
            console.log(`failed to read docs directory: ${path_to_docs}`);
            console.log(error);
            console.log(`\n`);
        }
    }
})();
