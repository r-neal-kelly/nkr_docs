$top_path                   = Resolve-Path -LiteralPath '.\'
$docs_path                  = "$top_path\docs"
$normalize_examples_path    = "$top_path\tools\normalize_examples"
$docs_config                = "$top_path\nkr_docs.doxywizard"

if (Test-Path -LiteralPath $docs_path -PathType Container) {
    Remove-Item -LiteralPath $docs_path -Recurse
}

doxygen $docs_config
Write-Host

Write-Host "normalizing code examples..."
node "$normalize_examples_path\normalize_examples" $docs_path
Write-Host
