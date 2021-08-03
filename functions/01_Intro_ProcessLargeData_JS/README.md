# processlargedatajs Function

This function takes a large JSON payload, calculates the distance between a supplied cordinate and the data, sorts it, and returns the nearest x results.

## Local Development

1. Install dependencies with

```
npm install
```

2. Run tests with

```
npm test
```

3. Start your function locally

```
sfdx run:function:start --verbose
```

4. Invoke your function locally

```
sfdx run:function --url=http://localhost:8080 --payload=@data/sample-payload
```