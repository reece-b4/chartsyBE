how to:
create local DB
seed local DB
seed neon prod DB
delete db
start for prod
start for dev including build - does this pre-start run before any more scripts (node docs)
dist clean
empty bucket
testing - do not have local server running already?
build for prod
deploy to lambda
  need to have serverless installed (best globally unless in a docker pipeline as docker will need it) CLI for managing serverless applications. It will build in the 
  @vendia/serverless-express wraps the express app so it can run in a lambda function - defined by serverless.yml
  .nvmrc NEEDS TO MATCH serverless.yml as this is what will be deployed (use latest stable version supported by lambda)
  lambda authorizations must be correct:
    allow:
Lambda & Logs
	•	lambda:* — Full access to Lambda functions
	•	logs:* — Full access to CloudWatch Logs (for function logging)

API Gateway
	•	apigateway:* — Manage API Gateway (used for exposing endpoints)

IAM (for Lambda execution roles)
	•	iam:PassRole
	•	iam:GetRole
	•	iam:CreateRole
	•	iam:AttachRolePolicy
	•	iam:TagRole
	•	iam:UntagRole
	•	iam:PutRolePolicy
	•	iam:DeleteRolePolicy

CloudFormation
	•	cloudformation:CreateStack
	•	cloudformation:DeleteStack
	•	cloudformation:DescribeStacks
	•	cloudformation:DescribeStackResources
	•	cloudformation:DescribeStackEvents
	•	cloudformation:DescribeStackResource
	•	cloudformation:GetTemplate
	•	cloudformation:UpdateStack
	•	cloudformation:ValidateTemplate
	•	cloudformation:ListStackResources
  •	cloudformation:DescribeChangeSet
  •	cloudformation:CreateChangeSet
  •	cloudformation:DeleteChangeSet
  •	cloudformation:ExecuteChangeSet

SSM Parameter Store (optional, for secrets/config)
	•	ssm:GetParameter
	•	ssm:PutParameter
	•	ssm:DeleteParameter

These are scoped to:
arn:aws:ssm:eu-west-2:<account-id>:parameter/serverless-framework/*

S3 (for deployment artifacts and frontend assets)
	•	s3:GetBucketLocation
	•	s3:CreateBucket
	•	s3:ListBucket
	•	s3:GetObject
	•	s3:PutObject
	•	s3:DeleteObject
	•	s3:DeleteBucket

Target buckets include:
	•	serverless-framework-deployments-eu-west-2-...
	•	chartsy-fe

CloudFront (optional, for frontend cache invalidation)
	•	cloudfront:CreateInvalidation
	•	cloudfront:GetInvalidation

Resource: arn:aws:cloudfront::<account-id>:distribution/<distribution-id>
or "Resource": "arn:aws:lambda:REGION:ACCOUNT_ID:function:FUNCTION_NAME"

Cost Explorer (optional, for cost monitoring)
	•	ce:GetCostAndUsage
	•	ce:GetCostForecast
	•	ce:GetDimensionValues
	•	ce:GetReservationUtilization
    cloudformation:DeleteChangeSet on resource: <correct resource>

    Resources set to "*" or specified where appropriate



how serverless works and steps to use it

endpoints explanations

overview of whole project
overview of BE project
overview of file structure
suggested to have AWS CLI globally installed

lambda is paired with AWS cloudfront CDN (content delivery network - caching content at edge locations, provides signed URLs and cookies. performance and security). AWS Lambda runs code in response to requests or events, without the need to manage servers. It only runs when invoked, which reduces costs compared to always-on servers.
Lambda puts the api into an S3 bucket
AWS docs: https://docs.aws.amazon.com/lambda/latest/dg/lambda-permissions.html#:~:text=Every%20Lambda%20function%20must%20have,role%20to%20satisfy%20this%20requirement.
Use a least-privilege permissions approach for security
You define the permissions that your Lambda function needs in a special IAM role called an execution role. In this role, you can attach a policy that defines every permission your function needs to access other AWS resources, and read from event sources. Every Lambda function must have an execution role. At a minimum, your execution role must have access to Amazon CloudWatch because Lambda functions log to CloudWatch Logs by default. You can attach the AWSLambdaBasicExecutionRole managed policy to your execution role to satisfy this requirement.
!! Use IAM Access Analyzer to help identify the required permissions for the IAM execution role policy and also discover unused permissions - some features free some not

AWS has a root user and an IAM user - logged in as root user in AWS CLI but it is IAM user which has permissions by attached policy to said user or you can have resource-based policies are attached directly to a Lambda function. For simple scenarios with a few resources, a resource-based policy is adequate and easier to manage. However, as your environment grows, IAM roles are recommended.

!! once initial deployment has happened ensure the serverless.yaml points to that bucket for re-deployments

serverless ESBuild is included out of the box for treeshaking to ensure upload to S3 bucket is within max file size

package manager, environment etc

start cicd processes with local script pointed to in package.json, github_pat needed in .env.CICD