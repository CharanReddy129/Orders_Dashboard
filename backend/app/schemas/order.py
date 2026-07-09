from marshmallow import Schema, fields, validate


class OrderCreateSchema(Schema):
    user_id = fields.Integer(required=True, validate=validate.Range(min=1))
    product_id = fields.Integer(required=True, validate=validate.Range(min=1))
    quantity = fields.Integer(load_default=1, validate=validate.Range(min=1))


class OrderUpdateSchema(Schema):
    status = fields.String()
