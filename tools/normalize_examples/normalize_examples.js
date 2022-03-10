/*
    Copyright 2022 r-neal-kelly
*/

`use strict`;

const /* object_t */    fs  = require(`fs`);
const /* string_t */    path_to_docs = `../../docs`;

/* string_t[] */ async function HTML_Files(directory_path)
{
    const /* regex_t */ html_regex = /\.html/;

    return new Promise(function (/* function_t */ Resolve, /* function_t */ Reject) {
        fs.readdir(directory_path, function (/* error_t */ error, /* string_t[] */ files) {
            if (error) {
                Reject(error);
            } else {
                Resolve(files.filter(/* string_t */ value => html_regex.test(value)));
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
    const /* regex_t */ normalized_line_regex = /(?<=<div class="line">)[^ ]/;
    const /* regex_t */ only_line_space_regex = /(?<=<div class="line">)  +/g;
    const /* string_t */ line_prefix = `<div class="line">`;

    let fragments = [];

    let match;
    while ((match = fragment_regex.exec(file_text)) !== null) {
        if (!normalized_line_regex.test(match[0])) {
            let fragment = {};
    
            fragment.text = match[0];
            fragment.first = match.index;
            fragment.end = match.index + match[0].length;
            fragments.push(fragment);
    
            let lines = fragment.text.match(only_line_space_regex);
            if (lines !== null) {
                let min_space_count = Math.min(...lines.map(value => value.length));
                fragment.text = fragment.text.replace(new RegExp(line_prefix + ' '.repeat(min_space_count), "g"), line_prefix);
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
    try {
        let html_files = await HTML_Files(path_to_docs);

        for (let html_file of html_files) {
            try {
                let file_text = await Read_File(`${path_to_docs}/${html_file}`);
                let normalized_file_text = Normalize_File_Text(file_text);
                try {
                    await Write_File(`${path_to_docs}/${html_file}`, normalized_file_text);
                } catch (error) {
                    console.log(`failed to write html file: ${html_file}`);
                    console.log(error);
                }
            } catch (error) {
                console.log(`failed to read html file: ${html_file}`);
                console.log(error);
            }
        }
    } catch(error) {
        console.log(`failed to read docs directory`);
        console.log(error);
    }
})();
