import { patterns } from '../../shared/utils/validation'
import { IGroupData } from '.'

export const onValidate = (values: IGroupData) => {
    const emailRegexp = new RegExp(patterns.email, 'i')

    const errors = {
        name: null,
        users: []
    }
    if (!values.name) {
        errors.name = "This field is mandatory"
    }

    values.users.map((user, index) => {
        if (!emailRegexp.test(user.email)) {
            errors.users[index] = { email: "Type a valid email here" }
        }
    })

    if (errors.name === null && errors.users.length === 0)
        return {};

    return errors
}