# Github workflows

`*-cicd.yml`: These workflows are the CICD workflows that are defined for each service. They run the unit test cases defined in each microservice and deploy them to Google Cloud Platform. The CI jobs are triggered upon pull request and push to `main` or `prod` while the CD jobs are triggered upon push to `prod` branch only.

`scale-*-cron-job.yml`: These 2 workflows delete the deployed pods at 2am SGT and redeploy the pods at 9am SGT. These 2 scheduled jobs are used to help us manage the costs of our deployment.

`create.yml` and `destroy.yml`: These 2 workflows can be manually run from Github Actions. They set up and tear down the kubernetes cluster on Google Cloud Platform to get it ready for deployment. These jobs have been created to ensure consistent configuration of the deployment environment even when initialized by different members.