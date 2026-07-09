from marshmallow import Schema, fields, validate


class ProductCreateSchema(Schema):
    name = fields.String(required=True, validate=validate.Length(min=2))
    category = fields.String(required=True, validate=validate.Length(min=2))
    price = fields.Float(required=True, validate=validate.Range(min=0.01))
    inventory = fields.Integer(load_only=True, validate=validate.Range(min=0))
    quantity_available = fields.Integer(load_only=True, validate=validate.Range(min=0))


class ProductUpdateSchema(Schema):
    name = fields.String(validate=validate.Length(min=2))
    category = fields.String(validate=validate.Length(min=2))
    price = fields.Float(validate=validate.Range(min=0.01))
    inventory = fields.Integer(load_only=True, validate=validate.Range(min=0))
    quantity_available = fields.Integer(load_only=True, validate=validate.Range(min=0))
