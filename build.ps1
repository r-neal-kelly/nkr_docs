$top_path                   = Resolve-Path -LiteralPath '.\'
$docs_path                  = "$top_path\docs"
$normalize_examples_path    = "$top_path\tools\normalize_examples"
$docs_config                = "$top_path\nkr_docs.doxywizard"

if (Test-Path -LiteralPath $docs_path -PathType Container) {
    Remove-Item -LiteralPath $docs_path -Recurse
}

doxygen $docs_config

cd $normalize_examples_path
node normalize_examples
cd $top_path

Write-Host
Write-Host press any key to continue...
Write-Host
Read-Host
