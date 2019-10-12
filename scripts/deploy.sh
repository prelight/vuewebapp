#!/usr/bin/bash

set -e

if [ "$CODEBUILD_BUILD_SUCCEEDING" = "0" ]; then 
    ## ビルドフェーズで失敗したらアップロードを実行しない
    exit 1;
else 
    echo Deploy started on `date`
    cd $build_artifacts_dir
    aws s3 sync . s3://$bucket --include "*" --exclude "index.html" --delete
    aws s3 cp index.html s3://$bucket --cache-control "no-store, no-cache, max-age=0" --expires "Mon, 26 Jul 1997 05:00:00 GMT"
    aws cloudfront create-invalidation --distribution-id $cdn_distribution_id --paths "/*"
fi
