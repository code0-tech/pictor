export const DUserLoginMutation = `
mutation login(
	$username: String,
	$email: String,
	$password: String!,
) {	
	usersLogin(input: { 
		email: $email,
		username: $username,
		password: $password,
	}) {
		errors {
			...on ActiveModelError { attribute type }
			...on MessageError { message }
		}
		userSession {
			user {
				admin
				avatarPath
				createdAt
				email
				firstname
				id
				lastname
				namespace {
					id
				}
				namespaceMemberships {
					nodes {
						id
					}
				}
				updatedAt
				username
			}
			active
			createdAt
			id
			token
			updatedAt
		}
	}
}`

export const DUserLoginMfaMutation = `
mutation login(
	$username: String,
	$email: String,
	$password: String!,
	$mfa_type: MfaType!,
	$mfa_value: String!
) {	
	usersLogin(input: { 
		email: $email,
		username: $username,
		password: $password,
		mfa: {
			type: $mfa_type,
			value: $mfa_value
		}
	}) {
		errors {
			...on ActiveModelError { attribute type }
			...on MessageError { message }
		}
		userSession {
			user {
				namespace {
					id
				}
			}
			active
			createdAt
			id
			token
			updatedAt
		}
	}
}
`