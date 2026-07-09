from marshmallow import Schema, fields, validate


class UserCreateSchema(Schema):
    name = fields.String(required=True, validate=validate.Length(min=2))
    email = fields.Email(required=True)
    role = fields.String(load_default="Customer")
    status = fields.String(load_default="Active")


class UserUpdateSchema(Schema):
    name = fields.String(validate=validate.Length(min=2))
    email = fields.Email()
    role = fields.String()
    status = fields.String()
